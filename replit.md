# FENUI Food Festival Application

## Overview

This is a full-stack TypeScript application for managing and displaying food from different countries at the FENUI festival. The application features a modern React frontend with a Node.js Express backend, using Drizzle ORM with PostgreSQL for data persistence. It includes user authentication, dish management, country management, and an admin panel for content administration.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds
- **Animation**: Framer Motion for smooth transitions and animations

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **API Design**: RESTful API endpoints following conventional patterns

### Database Design
The application uses PostgreSQL with the following main entities:
- **Users**: Admin authentication and authorization
- **Countries**: Festival participating countries with flags and ordering
- **Dishes**: Food items with detailed information, categorization, and media
- **Dish Views**: Analytics tracking for dish popularity

## Key Components

### Data Models
1. **Users Table**: Stores admin credentials with hashed passwords
2. **Countries Table**: Manages participating countries with emoji flags, images, and display order
3. **Dishes Table**: Comprehensive dish information including pricing, categories, allergens, and availability
4. **Dish Views Table**: Tracks user interactions for analytics

### API Structure
- `/api/countries` - Country management endpoints
- `/api/dishes` - Dish CRUD operations with filtering capabilities
- `/api/admin` - Administrative functions and statistics
- Session management for authentication

### Frontend Features
- **Home Page**: Public-facing interface with country stories, dish filtering, and search
- **Admin Panel**: Protected administrative interface for content management
- **Responsive Design**: Mobile-first approach with smooth animations
- **Real-time Updates**: Optimistic updates with query invalidation

## Data Flow

1. **Authentication Flow**: Admin login with session-based authentication
2. **Content Management**: Admin creates/updates countries and dishes through forms
3. **Public Display**: Visitors browse dishes by country, category, or search terms
4. **Analytics**: Dish views are tracked for popularity metrics
5. **Filtering System**: Multi-dimensional filtering by country, category, and availability

## External Dependencies

### Production Dependencies
- **UI Components**: Extensive Radix UI component library for accessibility
- **Database**: Neon PostgreSQL serverless database
- **Session Storage**: PostgreSQL-based session storage
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for enhanced user experience

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast development server with HMR
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast production bundling for the server

## Deployment Strategy

The application is configured for deployment on Replit with:
- **Development**: `npm run dev` - Runs both frontend and backend in development mode
- **Production Build**: `npm run build` - Creates optimized client bundle and server build
- **Production Start**: `npm run start` - Serves the built application
- **Database Management**: `npm run db:push` - Applies schema changes to PostgreSQL

### Environment Setup
- PostgreSQL database URL required for data persistence
- Session-based authentication for admin features
- Static file serving for production builds
- Port configuration for Replit deployment

### Scaling Considerations
- Database connection pooling with Neon serverless PostgreSQL
- Optimized queries with Drizzle ORM
- Client-side caching with TanStack Query
- Image optimization for dish photos

## Changelog
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.