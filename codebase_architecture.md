# Codebase Architecture & Context

## 1. Tech Stack Overview
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + Custom CSS (`index.css`). Heavy use of custom fonts (Anakotmai for Thai, Inter for English).
- **Animations**: Framer Motion (`framer-motion`) is used extensively across pages for scroll animations, transitions, and interactive elements.
- **Routing**: `react-router-dom` for client-side routing.
- **State Management**: Standard React Hooks (`useState`, `useEffect`). Global states like language (`lang`) are elevated to `App.jsx` and passed down as props, backed by `localStorage`.
- **Backend / DB**: Supabase (`lib/supabase.js`) for storing dynamic data (e.g., Map feedback issues) and potentially authentication (`AuthContext.jsx`). Data fetching utilizes `@tanstack/react-query`.

## 2. Global Application Flow (`src/App.jsx`)
The application's entry point sets up routing and global state:
- Initializes the `lang` state (Thai 'th' or English 'en') based on the browser's language or previous user selection in `localStorage`.
- Handles routing via `<Routes>` and page transitions using `AnimatePresence`.
- Core Routes:
  - `/`: Home Page
  - `/policies`: 3 Dimensional Policies Overview
  - `/dimension/:dimensionId`: Subcategories of a specific policy dimension
  - `/policy/detail/:policyId`: Deep dive into a specific policy
  - `/leadership`: Candidates & Leadership Teams
  - `/team/:teamId`: Detailed page for a specific team
  - `/map`: Interactive School Map for Issue Reporting

## 3. Directory Structure & Architecture

### `src/components/` (Modular UI)
- **`party/`**: Contains the core layout and landing page sections.
  - `Navbar.jsx` / `Footer.jsx`: Global navigation and footer.
  - `HeroSection.jsx`, `PoliciesSection.jsx`, `LeadershipSection.jsx`, `MembersSection.jsx`: These act as the building blocks for the Home page and other top-level pages.
- **`map/`**: A highly interactive module dedicated to the "Report Issue" feature.
  - `MapCanvas.jsx`, `ZonePolygon.jsx`, `ZoneBubble.jsx`: Renders an interactive map with clickable zones.
  - `ZoneSidebar.jsx`, `FeedbackModal.jsx`: Interfaces for users to submit and view feedback on specific school zones.
- **`ui/`**: Generic, reusable UI elements (e.g., `toaster.jsx` for notifications).

### `src/pages/` (Route Views)
- Pages compose the components from `src/components` and inject the necessary data.
- **`PoliciesPage.jsx` -> `PoliciesDiCategory.jsx` -> `PolicyDetailPage.jsx`**: A cascading navigation flow for policies. Users start at the dimension overview, drill down into subcategories, and finally read the details of a single policy.
- **`LeadershipPage.jsx`**: Renders candidate profiles and team overviews.

### `src/data/` (Static Data Sources)
Instead of fetching all data from a database, the app heavily relies on static JS objects for content, which ensures blazing-fast load times.
- `unifiedPoliciesData.js`: A massive file containing the entire hierarchical structure of dimensions, categories, and policy details (Why, How, Outcome, Feasibility).
- `teamsData.js` & `teamMembersData.js`: Contains information about different student council teams and their respective members.
- `candidateData.js`: Information about the core candidates.

### `src/lib/` & `src/hooks/` (Utilities)
- **`supabase.js`**: Initializes the Supabase client.
- **`query-client.js`**: Sets up React Query for caching and fetching backend data.
- **`AuthContext.jsx`**: Manages user authentication state.
- **`useFeedback.js`**: A custom hook encapsulating the logic to fetch/submit map feedback from Supabase.
- **`use-mobile.jsx`**: A utility hook to detect if the user is on a mobile device to alter UI rendering.

## 4. Key Design Patterns
- **Bilingual Component Architecture**: Almost all text content is conditionally rendered based on the `lang` prop (`lang === 'th' ? 'Thai' : 'English'`). This avoids heavy i18n libraries and keeps the codebase simple.
- **Dynamic Routing & Data Matching**: Pages like `PolicyDetailPage` or `TeamMembersPage` use URL parameters (`useParams()`) to extract IDs, which are then used to look up the exact data object in the `src/data/` static files.
- **"Cinematic" UI**: The app focuses heavily on modern, premium aesthetics. It uses dark mode by default (`#0B0F17`), glassmorphism (`bg-white/5`), wide tracking for English typography, and scroll-triggered animations to create a "wow" effect.
