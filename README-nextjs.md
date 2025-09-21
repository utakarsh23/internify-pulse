# Internify Pulse - Next.js Migration

This project has been migrated from Vite + React to Next.js 14 with App Router.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:7470`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   API_BASE_URL=http://localhost:7470
   NEXT_PUBLIC_API_BASE_URL=http://localhost:7470
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
internify-pulse/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/                # Login page
│   │   └── layout.tsx            # Auth layout
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── profile/              # Company profile page
│   │   ├── internships/          # Internship management
│   │   └── layout.tsx            # Dashboard layout
│   ├── api/                      # API routes
│   │   └── auth/[...nextauth]/   # NextAuth configuration
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects to profile)
│   ├── not-found.tsx             # 404 page
│   └── providers.tsx             # App providers
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout components
│   └── modals/                   # Modal components
├── lib/                          # Utilities and configurations
│   ├── api.ts                    # API client with session support
│   └── utils.ts                  # Utility functions
├── hooks/                        # Custom React hooks
├── middleware.ts                 # Authentication middleware
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🔑 Key Features

### Authentication
- **NextAuth.js integration** with credentials provider
- **Session management** with JWT tokens
- **Protected routes** via middleware
- **Automatic token refresh** and logout on expiry

### API Integration
- **Session-aware API client** using axios interceptors
- **Automatic token injection** from NextAuth sessions
- **Error handling** with automatic redirect on 401
- **Backend compatibility** maintained with existing endpoints

### UI Components
- **shadcn/ui components** for consistent design
- **Responsive design** with Tailwind CSS
- **Glass morphism effects** and modern styling
- **Dark/light theme support** (ready for implementation)

### Pages & Routing
- **App Router** with nested layouts
- **Route groups** for auth and dashboard sections
- **Dynamic routing** for internship details
- **404 handling** with custom not-found page

## 🔧 Configuration Files

### Key Configuration Updates

1. **next.config.js** - Next.js configuration with API proxy
2. **middleware.ts** - Authentication middleware for protected routes
3. **tsconfig.json** - TypeScript paths and Next.js integration
4. **tailwind.config.js** - Updated for Next.js content paths

### Environment Variables

Required environment variables:
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Application URL
- `API_BASE_URL` - Backend API URL (server-side)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (client-side)

## 🔄 Migration Changes

### From Vite to Next.js
- ✅ **React Router** → **Next.js App Router**
- ✅ **Vite dev server** → **Next.js dev server**
- ✅ **Manual auth** → **NextAuth.js**
- ✅ **localStorage tokens** → **Session-based auth**
- ✅ **Client-side routing** → **Server-side routing**

### API Changes
- ✅ **Added session support** to API client
- ✅ **Maintained existing endpoints** compatibility
- ✅ **Enhanced error handling** with redirect
- ✅ **Server-side token management**

### Component Updates
- ✅ **'use client' directives** for interactive components
- ✅ **Next.js Link components** instead of React Router
- ✅ **usePathname** instead of useLocation
- ✅ **Server and client component separation**

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Environment Variables for Production
Set the following in your deployment platform:
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `API_BASE_URL`
- `NEXT_PUBLIC_API_BASE_URL`

## 🐛 Troubleshooting

### Common Issues

1. **Session not persisting**
   - Check `NEXTAUTH_SECRET` is set
   - Verify `NEXTAUTH_URL` matches your domain

2. **API calls failing**
   - Ensure backend is running on correct port
   - Check `API_BASE_URL` configuration
   - Verify CORS settings on backend

3. **Build errors**
   - Check for `'use client'` directives on interactive components
   - Verify all imports are correctly typed

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note:** This migration maintains all existing functionality while adding modern Next.js features like server-side rendering, improved SEO, and better performance.