# Godavari Cafe App - Development Guide

This document provides a comprehensive A-Z overview of how this application is built, including the technologies, libraries, architecture, and core features.

## 1. Core Tech Stack

- **Framework**: [Next.js (v16.2.9)](https://nextjs.org/) using the **App Router** paradigm.
- **Library**: [React (v19)](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for robust static typing.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for rapid UI development and styling.

## 2. Key Libraries & Integrations

- **AI Integration**: `@google/genai` is used to power the intelligent AI Chatbot which acts as a virtual waiter, giving menu recommendations and taking orders.
- **Database & Auth**: `@supabase/supabase-js` is integrated for backend services (Auth and PostgreSQL database).
- **Animations**: `framer-motion` is heavily used throughout the application to provide fluid, iOS-like micro-interactions, liquid glass effects, and page transitions.
- **Icons**: `lucide-react` provides a clean, consistent SVG icon system.
- **Charts & Dashboards**: `recharts` is utilized in the Admin section to display interactive daily revenue charts.
- **PDF Generation**: `jspdf` is used to generate downloadable bills and invoices for the customers.
- **QR Codes**: `qrcode` library is used to generate dynamic QR codes for tables.
- **Payments**: `razorpay` was initially integrated, but currently, the app uses a custom Mock Payment flow for testing.
- **Date Utilities**: `date-fns` handles date formatting for the admin dashboards and order tracking.
- **Authentication / JWT**: `jose` is used for handling JSON Web Tokens securely.

## 3. Project Architecture & Structure

The project follows the standard Next.js App Router structure:

```text
src/
├── app/                  # Application Routes (Pages & Layouts)
│   ├── admin/            # Admin dashboard (Revenue, Analytics)
│   ├── api/              # Backend API routes (AI chat, Payments)
│   ├── checkout/         # Mock payment and checkout flow
│   ├── kitchen/          # Kitchen Display System (KDS) for incoming orders
│   ├── menu/             # Digital Menu for customers
│   ├── order-status/     # Live order tracking page
│   ├── restaurant/       # Godavari Restaurant branding page
│   ├── rooms/            # Godavari Rooms & Booking page
│   └── sky-lounge/       # Godavari Sky Lounge page
├── components/           # Reusable UI Components
│   ├── GodavariLogo.tsx  # Branding components
│   ├── GodavariNavbar.tsx
│   ├── GodavariFooter.tsx
│   ├── AIChatWidget.tsx  # Chatbot UI
│   ├── LanguageSelector.tsx # Localization
│   └── ...
└── lib/                  # Utilities, Types, and Global State
    ├── store.ts          # Custom global state and mock database
    ├── supabase.ts       # Supabase client initialization
    ├── types.ts          # TypeScript interfaces
    └── i18n/             # Internationalization dictionaries
```

## 4. State Management & Data Flow

- **Development Data Store**: The application uses a custom in-memory store (`global.__CAFE_STORE__` in `src/lib/store.ts`) to persist state across Next.js API route calls during local development. This mimics a real database by storing `categories`, `items`, `orders`, and `bills`.
- **Client State**: Standard React hooks (`useState`, `useEffect`) manage local UI state (e.g., cart items, chat history).

## 5. Core Features

### Digital Menu & Ordering
- **Multilingual Support**: The menu is available in multiple languages (English, Telugu, Hindi, Kannada) allowing users to switch dynamically via the `LanguageSelector`.
- **Categorization**: Items are broken down by region and type (e.g., Andhra Specials, Telangana Specials, Godavari Ruchulu).
- **Cart & Checkout**: Users can add items to their cart, proceed to checkout, and interact with the mock payment gateway.

### AI Virtual Waiter
- **Context-Aware Recommendations**: Powered by Google GenAI, the `AIChatWidget` understands the menu and context, answering user questions about ingredients, spice levels, and allergies.
- **Inline Cart Suggestions**: The chatbot can dynamically suggest items and add them directly to the user's cart.

### Operations (Kitchen & Admin)
- **Kitchen Interface**: A real-time updating list of orders so chefs can mark items as prepared.
- **Admin Dashboard**: Visualizes daily revenue using Recharts and tracks order histories.
- **Order Tracking**: Customers can check the real-time status of their food.

### Rebranding to Godavari Multi-Facility
The app recently underwent a UI polish and rebranding to the **Godavari** brand, encompassing a Restaurant, Rooms, and Sky Lounge, tied together by consistent, premium navigation (Navbar/Footer) and a beige/red-gold color theme.
