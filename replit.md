# Smart Grocery Budgeter

## Overview

Smart Grocery Budgeter is a mobile-friendly web application that helps users plan grocery shopping within budget constraints. The application generates optimized grocery lists based on user-specified budgets, dietary preferences (keto, vegan, or none), and household size. It provides AI-powered savings tips and budget tracking features, with fallback data to ensure functionality even when external API limits are reached.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript  
**UI Library**: shadcn/ui components built on Radix UI primitives  
**Styling**: Tailwind CSS with custom design tokens  
**Routing**: Wouter (lightweight client-side routing)  
**State Management**: TanStack Query (React Query) for server state  

The frontend follows a component-based architecture with reusable UI components stored in `client/src/components/ui/`. Page components are located in `client/src/pages/`. The application uses a custom color scheme centered around teal (#008080) as the primary color, designed for clarity and mobile responsiveness.

**Key Design Decisions**:
- shadcn/ui provides accessible, customizable components while maintaining consistency
- Tailwind CSS enables rapid development with utility-first styling
- React Query handles API data fetching, caching, and synchronization automatically
- Single-page application architecture with client-side routing for smooth navigation

### Backend Architecture

**Framework**: Express.js with TypeScript  
**Build Tool**: Vite for development with HMR (Hot Module Replacement)  
**Runtime**: Node.js with ESM modules  

The backend follows a simple REST API pattern with routes defined in `server/routes.ts`. The main server setup is in `server/index.ts`, which configures middleware, error handling, and integrates Vite for development mode.

**API Endpoints**:
- `POST /api/budget` - Generates grocery lists based on budget and preferences
- `POST /api/save-list` - Saves generated lists to the database
- `GET /api/user/:userId` - Retrieves saved lists for a user

**Key Design Decisions**:
- Express provides a minimal, flexible framework suitable for the API requirements
- Separation of concerns with routes, storage, and server configuration in distinct files
- Fallback to local JSON data when API limits are reached, ensuring uninterrupted service
- Rule-based AI for generating savings tips (e.g., bulk purchase suggestions, item swaps)

### Data Storage

**Database**: PostgreSQL via Neon serverless  
**ORM**: Drizzle ORM with TypeScript-first schema definitions  

**Schema Design**:
- `grocery_lists` table: Stores user grocery lists with budget, preferences, items (JSONB), total cost, and AI-generated tips
- `api_call_limits` table: Tracks daily API usage to enforce rate limiting (150 calls/day)

**Key Design Decisions**:
- PostgreSQL chosen for relational data integrity and JSONB support for flexible item storage
- Drizzle ORM provides type-safe database queries and migrations
- Neon serverless offers automatic scaling and connection pooling
- JSONB column for grocery items allows flexible schema while maintaining queryability
- Daily API call tracking prevents exceeding external service limits

### External Dependencies

**Third-Party Services**:
- Edamam API (planned): Food and nutrition database for price estimation
  - Free tier supports 150 calls/day
  - Currently uses placeholder credentials
  - Fallback mechanism uses `groceries.json` with 20+ sample items

**UI Component Libraries**:
- Radix UI: Accessible component primitives for dialogs, dropdowns, accordions, etc.
- Lucide React: Icon library for consistent iconography
- date-fns: Date formatting and manipulation

**Development Tools**:
- Replit-specific plugins for enhanced development experience
- WebSocket support (via `ws`) for Neon database connections
- TypeScript for type safety across the entire stack

**Key Design Decisions**:
- Fallback data strategy ensures the app remains functional without external API access
- shadcn/ui components are copied into the project for full customization control
- Minimal external dependencies to reduce bundle size and improve performance
- Environment-based configuration for API keys and database URLs