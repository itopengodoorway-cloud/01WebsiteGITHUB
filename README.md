# IOG.doorway Golf Coaching App

Professional online golf coaching platform with personalized video feedback, progress tracking, and membership management.

## Features

- **User Authentication**: Email/password signup with magic links and password reset
- **Handicap Management**: Track golf handicap history with visual graphs
- **Video Libraries**: Free and paid video content libraries
- **CO-CHAT System**: Real-time coaching chat with video recording and annotation tools
- **Membership Tiers**: Free and €49/month paid subscriptions with Stripe integration
- **Admin Dashboard**: Full content and user management
- **Responsive Design**: Mobile-first, fully responsive across all devices

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with Row Level Security
- **Payments**: Stripe
- **Hosting**: Vercel
- **UI Components**: Lucide Icons, Framer Motion
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier available)
- Stripe account (test mode)
- Vercel account (optional, for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/itopengodoorway-cloud/01WebsiteGITHUB.git
cd 01WebsiteGITHUB
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase and Stripe credentials.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Phases

This project is built following a 12-phase development checklist:

1. **Phase 1**: Project Initialization ✓
2. **Phase 2**: Database Design & Supabase Configuration
3. **Phase 3**: Authentication & User Onboarding
4. **Phase 4**: User Profiles & Handicap Management
5. **Phase 5**: Membership Tier & Payment System
6. **Phase 6**: Main Dashboard & Navigation
7. **Phase 7**: Video Libraries & Content Management
8. **Phase 8**: Video Player & Progress Tracking
9. **Phase 9**: CO-CHAT - Interactive Coaching System
10. **Phase 10**: Admin Dashboard & Full Control
11. **Phase 11**: Settings Page & Additional Features
12. **Phase 12**: Final Polish, Responsive Design & Testing

## Environment Variables

See `.env.local` for all required environment variables with descriptions.

## Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy with a single click

## Development

### Build
```bash
npm run build
```

### Format & Lint
```bash
npm run lint
```

## License

Private project - IOG.doorway

## Support

For issues or questions, contact the development team.<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# 01WebsiteGITHUB
website for Coaching online with chat with option to add video, libraries for sale, memberships
>>>>>>> 20b04a362bb50d590464efc8daf8274ff44f6f56
