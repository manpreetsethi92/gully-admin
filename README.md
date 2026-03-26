# Titlii Admin Dashboard

A professional React + TypeScript admin dashboard for managing the titlii.social platform. Built with Vite, Tailwind CSS, and modern web technologies.

## Features

- **Dashboard/Overview** — Platform statistics and quick actions
- **WA Group Jobs** — Manage jobs ingested from WhatsApp groups (NEW!)
- **Job Pipeline** — Monitor the job processing pipeline
- **Requests** — Manage user requests for jobs and collaborations
- **Matches** — Track AI-powered matches between users and requests
- **Users** — Manage user accounts and profiles
- **Messaging** — Monitor message delivery and platform communication
- **Growth** — Track platform growth and user engagement
- **Activity Log** — View all platform events and activities

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Data:** Axios for API calls
- **Routing:** React Router

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs the app in development mode at [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Creates a production build in the `dist/` directory.

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_URL=https://titly-backend-production.up.railway.app/api
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Railway

Push to GitHub and connect the repo to Railway.

### Self-Hosted

```bash
npm run build
npm run preview  # Test the build locally
```

Deploy the `dist/` folder to your server.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── TopBar.tsx
│   ├── StatCard.tsx
│   └── DataTable.tsx
├── pages/             # Page components (routes)
│   ├── Dashboard.tsx
│   ├── WAGroupJobs.tsx    # NEW: WhatsApp group jobs
│   ├── JobPipeline.tsx
│   ├── Requests.tsx
│   ├── Matches.tsx
│   ├── Users.tsx
│   ├── Messaging.tsx
│   ├── Growth.tsx
│   └── ActivityLog.tsx
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
│   ├── api.ts         # API calls
│   ├── format.ts      # Data formatting
│   └── colors.ts      # Color utilities
├── App.tsx            # Root component with routing
├── index.css          # Global styles
└── main.tsx           # Entry point
```

## Features Breakdown

### WA Group Jobs (NEW)
- View all jobs ingested from WhatsApp groups
- Filter by status, group name, and location
- See contact information for each job
- View matched users for each job
- Trigger re-matching manually

### Job Pipeline
- Monitor job processing stages (scraped → haiku → batch → processed → notified)
- View success rates
- Manage job queue

### Matches
- Track all AI-powered matches
- See match scores and reasons
- Update match statuses
- Bulk notify matched users

### Users
- Manage user profiles
- View skills, location, verification status
- Track profile completion

### Growth Metrics
- User funnel visualization
- Daily/weekly/monthly active users
- Retention and signup trends
- Top locations and skills

## API Integration

The dashboard connects to the titly-backend API. Key endpoints used:

- `GET /api/admin/wa-group-jobs` — WA group jobs list
- `GET /api/admin/dashboard/overview` — Overview stats
- `GET /api/admin/dashboard/jobs` — Job pipeline
- `GET /api/admin/dashboard/requests` — Requests
- `GET /api/admin/dashboard/matches` — Matches
- `GET /api/admin/dashboard/users` — Users
- `GET /api/admin/dashboard/growth` — Growth metrics

See `src/utils/api.ts` for all API calls.

## Customization

### Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
colors: {
  dark: {
    bg: '#0a0a0a',
    surface: '#1a1a1a',
    border: 'rgba(255,255,255,0.1)',
  },
  accent: {
    DEFAULT: '#E50914',  // Titlii brand red
  }
}
```

### Add New Pages

1. Create a new file in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/Sidebar.tsx`

### Add New Components

Create new components in `src/components/` and import where needed.

## Performance

- Vite for fast builds
- Code splitting via React Router
- Lazy loading for pages
- Optimized renders with React.memo

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, contact the Titlii team.
