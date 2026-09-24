# Product Admin Dashboard

A modern, responsive, and beautiful admin dashboard for managing products, built with React, TypeScript, Tailwind CSS, and Vite. Data is sourced from the [DummyJSON Products API](https://dummyjson.com/docs/products).

## Features & Accomplishments

During the latest development cycle, the following key improvements and fixes were implemented:

- **Complete Theme Overhaul**: Redesigned the color system in `index.css` to use a sophisticated, cohesive violet and zinc neutral palette. Improved dark mode support, subtle glassmorphism effects (Navbar/Sidebar), and soft UI shadows.
- **Improved Sidebar & Layout**: Redesigned the navigation layout to include active context states, a sleek user card, and a seamless `bg-canvas` layout standard.
- **Dropdown Component Rebuilt**: Fixed significant "merging" and clipping issues in the Dropdown component. The search input now safely resides within the dropdown options panel and aggressively strips native browser focus rings for a premium look.
- **Filtering & Search Logic**: Handled DummyJSON limitations (where search and category cannot be combined server-side) gracefully. The UI now auto-clears conflicting filters and correctly paginates through categories.
- **Table Pagination Fixes**: Resolved race conditions in React Router's `setSearchParams` where limit selector clicks would overwrite pagination states. The Table limit filter (`5`, `10`, `20`, `50`) now perfectly syncs with the API.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom design system)
- **State Management**: Zustand (local state & caching) & React Query (server state)
- **Routing**: React Router v6
- **Forms**: Formik & Yup

## Setup Instructions

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Installation

Clone the repository and install the dependencies:

```bash
# Clone the repository
git clone https://github.com/MJaman786/product-placeholder.git

# Navigate into the project directory
cd frontend

# Install dependencies using npm (or yarn/pnpm)
npm install
```

### 2. Environment Setup

If necessary, create a `.env` file in the root of the project to specify the API URL. By default, the app will fall back to `https://dummyjson.com`.

```env
VITE_API_URL=https://dummyjson.com
```

### 3. Running the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite in your terminal).

### 4. Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be generated in the `dist` folder. You can preview the production build locally using:

```bash
npm run preview
```

## Note on DummyJSON Mutations
Since this project uses the DummyJSON API, all mutating endpoints (Create, Update, Delete) are simulated. They will return a successful response with the modified data, but the data will not actually persist on the server for subsequent GET requests. Local state overrides are used in this app (`useProductStore`) to reflect those changes in the UI temporarily during your session.
