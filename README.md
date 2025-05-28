# The Epic Battle of 204 - Frontend

A modern Next.js admin panel for domain management and filtering, designed to help administrators manage whitelist and blacklist domains with an intuitive interface.

## ✨ Features

### 🔐 Authentication
- Secure admin login with JWT token-based authentication
- Persistent session management with localStorage
- Auto-logout on token expiration

### 📋 Domain Management
- **View Domain Lists**: Browse and search through whitelist and blacklist domains
- **Bulk Domain Upload**: Add multiple domains at once via text input or file upload
- **Individual Domain Management**: Add single domains with real-time validation
- **Manual & LLM Sources**: Support for both manually added and LLM-generated domain lists
- **Search & Pagination**: Fast search with paginated results across all domain lists

### 📊 Statistics & Monitoring
- Real-time domain statistics (total, whitelist, blacklist counts)
- Recent activity logs with detailed timestamps
- Visual status indicators for blocked, allowed, and reviewed domains
- Comprehensive audit trail for domain operations

### 🎨 Modern UI/UX
- Beautiful gradient designs with dark mode support
- Responsive layout optimized for all screen sizes
- Material Design icons throughout the interface
- Smooth animations and hover effects
- Tailwind CSS for consistent styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Backend API server running on port 8000

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd the-epic-battle-of-204-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Configuration

The application automatically detects the API backend URL:
- **Development**: `http://localhost:8000`
- **Production**: Uses the same hostname as the frontend with port 8000

You can override this by setting the `NEXT_PUBLIC_API_BASE` environment variable.

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: Tailwind CSS with custom components
- **HTTP Client**: Axios for API communication
- **Icons**: Material Symbols Outlined
- **Fonts**: Geist Sans & Geist Mono

### Project Structure
```
├── src/app/              # Next.js app directory
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main application entry
├── components/           # React components
│   ├── AdminPanel.tsx    # Main admin interface
│   ├── LoginPanel.tsx    # Authentication form
│   ├── DomainsTable.tsx  # Domain list viewer
│   ├── BulkInsertForm.tsx # Bulk domain upload
│   ├── StatsPanel.tsx    # Statistics dashboard
│   └── Tabs.tsx          # Navigation tabs
└── lib/                  # Utilities and API
    ├── api.ts            # API client functions
    └── types.ts          # TypeScript type definitions
```

## 🔧 API Integration

The frontend communicates with a REST API backend with the following endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/lists/{source}/{list_type}/domains` - Fetch domain lists
- `POST /api/lists/manual/{list_type}/domains` - Add single domain
- `DELETE /api/lists/{source}/{list_type}/domains/{domain}` - Remove domain
- `GET /api/domain-logs` - Fetch activity logs
- `GET /api/lists/stats` - Get domain statistics

## 🎯 Usage

### Admin Login
1. Navigate to the application
2. Enter admin credentials
3. Click "Login" to access the admin panel

### Managing Domains
1. **View Lists**: Use the "View Domain Lists" tab to browse existing domains
2. **Add Domains**: Switch to "Add to Domain Lists" for bulk uploads
3. **Monitor Activity**: Check "Statistics" for system insights

### Domain Operations
- **Search**: Use the search boxes to find specific domains
- **Delete**: Click the × button next to any domain to remove it
- **Bulk Add**: Paste multiple domains (one per line) or upload a text file
- **Validation**: Real-time validation ensures only valid domains are added

## 🚢 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with automatic builds and previews

### Manual Deployment
```bash
npm run build
npm start
```

## 📝 License

This project is part of "The Epic Battle of 204" domain management system.
