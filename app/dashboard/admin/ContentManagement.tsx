"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-browser";
import { Plus, Trash2, Edit2, Loader2, Video, Library, ChevronRight, X, ExternalLink } from "lucide-react";

export default function AdminContentManagement() {
  const [activeTab, setActiveTab] = useState<"libraries" | "videos">("libraries");
  const [libraries, setLibraries] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: libs } = await supabase.from("libraries").select("*").order("created_at", { ascending: false });
    const { data: vids } = await supabase.from("videos").select("*, libraries(name)").order("created_at", { ascending: false });
    if (libs) setLibraries(libs);
    if (vids) setVideos(vids);
    setLoading(false);
  }

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) alert(error.message);
    else fetchData();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-[color:var(--surface)] p-2 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab("libraries")}
          className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'libraries' ? 'bg-[color:var(--primary)] text-white shadow-lg' : 'text-[color:var(--muted)] hover:text-[color:var(--secondary)]'}`}
        >
          Libraries
        </button>
        <button 
          onClick={() => setActiveTab("videos")}
          className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'videos' ? 'bg-[color:var(--primary)] text-white shadow-lg' : 'text-[color:var(--muted)] hover:text-[color:var(--secondary)]'}`}
        >
          Videos
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[color:var(--secondary)]">
          Manage {activeTab === 'libraries' ? 'Libraries' : 'Videos'}
        </h2>
        <button 
          onClick={() => { setEditingItem(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[color:var(--accent)] text-[color:var(--secondary)] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>

      {activeTab === "libraries" ? (
        <div className="grid gap-4">
          {libraries.map((lib) => (
            <div key={lib.id} className="bg-white border border-[color:var(--border)] p-6 rounded-[32px] flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[color:var(--primary)]/5 flex items-center justify-center text-[color:var(--primary)]">
                  <Library className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[color:var(--secondary)]">{lib.name}</h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${lib.is_paid ? 'bg-[color:var(--accent)]/10 text-[color:var(--accent)]' : 'bg-green-100 text-green-700'}`}>
                      {lib.is_paid ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  <p className="text-xs text-[color:var(--muted)] font-medium mt-1 line-clamp-1 max-w-md">{lib.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setEditingItem(lib); setModalOpen(true); }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[color:var(--background)] text-[color:var(--muted)] hover:text-[color:var(--primary)] transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete("libraries", lib.id)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[color:var(--background)] text-[color:var(--muted)] hover:text-red-600 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-white border border-[color:var(--border)] p-6 rounded-[32px] flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[color:var(--primary)]/5 flex items-center justify-center text-[color:var(--primary)] relative overflow-hidden">
                   {vid.thumbnail_url ? <img src={vid.thumbnail_url} className="w-full h-full object-cover" /> : <Video className="h-6 w-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[color:var(--secondary)]">{vid.title}</h3>
                    <span className="text-[10px] font-black uppercase text-[color:var(--muted)] tracking-widest">in {vid.libraries?.name}</span>
                  </div>
                  <p className="text-xs text-[color:var(--muted)] font-medium mt-1">ID: {vid.youtube_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={`https://youtube.com/watch?v=${vid.youtube_id}`} 
                  target="_blank"
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[color:var(--background)] text-[color:var(--muted)] hover:text-[color:var(--primary)] transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button 
                  onClick={() => { setEditingItem(vid); setModalOpen(true); }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[color:var(--background)] text-[color:var(--muted)] hover:text-[color:var(--primary)] transition-all"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete("videos", vid.id)}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-[color:var(--background)] text-[color:var(--muted)] hover:text-red-600 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ContentModal 
          type={activeTab} 
          item={editingItem} 
          libraries={libraries}
          onClose={() => setModalOpen(false)} 
          onSuccess={() => { setModalOpen(false); fetchData(); }} 
        />
      )}
    </div>
  );
}

function ContentModal({ type, item, libraries, onClose, onSuccess }: { type: "libraries" | "videos"; item: any; libraries: any[]; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(item || (type === 'libraries' ? {
    name: "",
    description: "",
    is_paid: false,
    price: 0
  } : {
    title: "",
    description: "",
    youtube_id: "",
    thumbnail_url: "",
    duration: "",
    library_id: libraries[0]?.id || ""
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Auto-generate thumbnail if empty and we have youtube_id
    let dataToSave = { ...formData };
    if (type === 'videos' && dataToSave.youtube_id && !dataToSave.thumbnail_url) {
       dataToSave.thumbnail_url = `https://img.youtube.com/vi/${dataToSave.youtube_id}/maxresdefault.jpg`;
    }

    const { error } = item 
      ? await supabase.from(type).update(dataToSave).eq("id", item.id)
      : await supabase.from(type).insert([dataToSave]);

    if (error) alert(error.message);
    else onSuccess();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[color:var(--secondary)]/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-white rounded-[48px] p-10 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-[color:var(--secondary)]">
            {item ? 'Edit' : 'Add'} {type === 'libraries' ? 'Library' : 'Video'}
          </h3>
          <button onClick={onClose} className="h-10 w-10 rounded-full bg-[color:var(--background)] flex items-center justify-center text-[color:var(--muted)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'libraries' ? (
            <>
              <Input label="Library Name" value={formData.name} onChange={(v) => setFormData({...formData, name: v})} required />
              <Textarea label="Description" value={formData.description} onChange={(v) => setFormData({...formData, description: v})} />
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[color:var(--background)]">
                <input 
                  type="checkbox" 
                  checked={formData.is_paid} 
                  onChange={(e) => setFormData({...formData, is_paid: e.target.checked})}
                  className="h-5 w-5 rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]" 
                />
                <span className="text-sm font-bold text-[color:var(--secondary)]">Premium (Paid) Library</span>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-[color:var(--muted)] ml-1">Parent Library</label>
                <select 
                  value={formData.library_id} 
                  onChange={(e) => setFormData({...formData, library_id: e.target.value})}
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 outline-none focus:border-[color:var(--primary)] transition-all font-bold text-sm"
                  required
                >
                  {libraries.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
              <Input label="Video Title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} required />
              <Input label="YouTube ID" value={formData.youtube_id} onChange={(v) => setFormData({...formData, youtube_id: v})} placeholder="e.g. dQw4w9WgXcQ" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Duration" value={formData.duration} onChange={(v) => setFormData({...formData, duration: v})} placeholder="e.g. 12:45" />
                <Input label="Custom Thumbnail URL (Optional)" value={formData.thumbnail_url} onChange={(v) => setFormData({...formData, thumbnail_url: v})} />
              </div>
              <Textarea label="Description" value={formData.description} onChange={(v) => setFormData({...formData, description: v})} />
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[color:var(--primary)] text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-[color:var(--primary)]/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {item ? 'Update' : 'Create'} {type === 'libraries' ? 'Library' : 'Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-[color:var(--muted)] ml-1">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 outline-none focus:border-[color:var(--primary)] transition-all font-bold text-sm"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase tracking-widest text-[color:var(--muted)] ml-1">{label}</label>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 outline-none focus:border-[color:var(--primary)] transition-all font-bold text-sm resize-none"
      />
    </div>
  );
}
