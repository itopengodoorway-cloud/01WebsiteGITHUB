"use client";

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import { 
  X, 
  Square, 
  Circle as CircleIcon, 
  Minus, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw,
  Palette,
  Maximize2
} from 'lucide-react';

export default function VideoAnnotationTool({ videoUrl, onClose, onSave }: any) {
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#D4AF37'); // Golf Gold
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });

  useEffect(() => {
    // Responsive sizing
    const updateSize = () => {
      const width = Math.min(window.innerWidth - 80, 1000);
      setDimensions({ width, height: width * (9/16) });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, color, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    
    if (tool === 'pen') {
       lastLine.points = lastLine.points.concat([point.x, point.y]);
    } else {
       // For shapes, we replace the second point
       lastLine.points[2] = point.x;
       lastLine.points[3] = point.y;
    }
    
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleExport = () => {
    const dataUrl = stageRef.current.toDataURL();
    onSave(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[color:var(--secondary)] flex flex-col">
      {/* Tool Header */}
      <header className="px-8 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-6">
           <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-all">
              <X className="h-6 w-6" />
           </button>
           <h2 className="text-xl font-black text-white uppercase tracking-tighter">Swing <span className="text-[color:var(--accent)]">Analyzer</span></h2>
        </div>
        
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
           <ToolBtn active={tool === 'pen'} onClick={() => setTool('pen')} icon={<Edit3 className="h-4 w-4" />} label="Draw" />
           <ToolBtn active={tool === 'line'} onClick={() => setTool('line')} icon={<Minus className="h-4 w-4" />} label="Line" />
           <ToolBtn active={tool === 'rect'} onClick={() => setTool('rect')} icon={<Square className="h-4 w-4" />} label="Box" />
           <ToolBtn active={tool === 'circle'} onClick={() => setTool('circle')} icon={<CircleIcon className="h-4 w-4" />} label="Circle" />
           <div className="w-px h-6 bg-white/10 mx-2"></div>
           <button onClick={handleUndo} className="h-10 px-3 rounded-xl hover:bg-white/10 text-white/60 transition-all flex items-center gap-2 text-[10px] font-black uppercase">
              <RotateCcw className="h-4 w-4" /> Undo
           </button>
           <button onClick={handleClear} className="h-10 px-3 rounded-xl hover:bg-red-500/20 text-red-400 transition-all flex items-center gap-2 text-[10px] font-black uppercase">
              <Trash2 className="h-4 w-4" /> Clear
           </button>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 h-12 rounded-2xl bg-black/40 border border-white/10">
              <div className="w-4 h-4 rounded-full border border-white/20" style={{ background: color }}></div>
              <select 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                className="bg-transparent text-[10px] font-black text-white uppercase outline-none"
              >
                 <option value="#D4AF37">Gold</option>
                 <option value="#EF4444">Red</option>
                 <option value="#10B981">Green</option>
                 <option value="#3B82F6">Blue</option>
              </select>
           </div>
           <button onClick={handleExport} className="h-12 px-8 rounded-2xl bg-[color:var(--accent)] text-[color:var(--secondary)] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Analysis
           </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
         <div className="relative shadow-2xl rounded-3xl overflow-hidden border border-white/10 bg-black" style={{ width: dimensions.width, height: dimensions.height }}>
            {/* Video Layer */}
            <video 
              ref={videoRef}
              src={videoUrl} 
              className="absolute inset-0 w-full h-full object-contain"
              controls
              playsInline
            />

            {/* Canvas Layer */}
            <div className="absolute inset-0 z-10 pointer-events-auto">
               <Stage
                 width={dimensions.width}
                 height={dimensions.height}
                 onMouseDown={handleMouseDown}
                 onMousemove={handleMouseMove}
                 onMouseup={handleMouseUp}
                 ref={stageRef}
               >
                 <Layer>
                   {lines.map((line, i) => {
                     if (line.tool === 'pen' || line.tool === 'line') {
                        return <Line key={i} points={line.points} stroke={line.color} strokeWidth={4} tension={0.5} lineCap="round" globalCompositeOperation="source-over" />;
                     }
                     if (line.tool === 'rect') {
                        const x = line.points[0];
                        const y = line.points[1];
                        const width = (line.points[2] || x) - x;
                        const height = (line.points[3] || y) - y;
                        return <Rect key={i} x={x} y={y} width={width} height={height} stroke={line.color} strokeWidth={3} />;
                     }
                     if (line.tool === 'circle') {
                        const x = line.points[0];
                        const y = line.points[1];
                        const radius = Math.sqrt(Math.pow((line.points[2] || x) - x, 2) + Math.pow((line.points[3] || y) - y, 2));
                        return <Circle key={i} x={x} y={y} radius={radius} stroke={line.color} strokeWidth={3} />;
                     }
                     return null;
                   })}
                 </Layer>
               </Stage>
            </div>
         </div>

         {/* Shortcuts Info */}
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 text-[color:var(--muted)] text-[10px] font-black uppercase tracking-[0.2em]">
            <p>Draw mechanics over impact frames</p>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <p>Export to save coaching feedback</p>
         </div>
      </div>
    </div>
  );
}

function ToolBtn({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`h-10 px-4 rounded-xl flex items-center gap-2 transition-all ${active ? 'bg-white text-[color:var(--secondary)] shadow-lg' : 'text-white/60 hover:bg-white/5'}`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase">{label}</span>
    </button>
  );
}
