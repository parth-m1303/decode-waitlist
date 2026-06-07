# Design Decode SaaS Landing Page

This is the front-end codebase for the **Design Decode SaaS Landing Page**. The application is designed to be a high-conversion, interactive landing page showcasing AI-powered code analysis features.

## 🚀 Tech Stack

- **Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript

## 🏗️ Architecture

The application is built as a Single Page Application (SPA) using React. The architecture is modular and component-driven.

The main entry point is `src/main.tsx`, which renders `src/app/App.tsx`. 
`App.tsx` acts as the primary layout controller, sequentially composing the landing page sections:

1. **Hero (`Hero.tsx`)** - Main call to action and value proposition.
2. **Problem (`Problem.tsx`)** - Highlights the pain points the product solves.
3. **ScanMe (`ScanMe.tsx`)** - An interactive mock of AI code scanning.
4. **Solution (`Solution.tsx`)** - How the product solves the problem.
5. **Features (`Features.tsx`)** - Key benefits and capabilities.
6. **Demo (`Demo.tsx`)** - Video/interactive demonstration section.
7. **Pricing (`Pricing.tsx`)** - Subscription tiers.
8. **FinalCTA (`FinalCTA.tsx`)** - Bottom call to action.
9. **Footer (`Footer.tsx`)** - Links and legal.

Additionally, there are modal overlays controlled by local state in `App.tsx`:
- `WaitlistModal.tsx`
- `VideoModal.tsx`

## 🔌 APIs, Endpoints & Flow

**Currently, this project is a purely static front-end prototype.** 

- **External APIs:** There are NO external API integrations (no `fetch` or `axios` calls). 
- **Waitlist Flow:** The "Join Waitlist" form (`WaitlistModal.tsx`) is a simulated frontend flow. When a user submits an email, the application waits for 2 seconds (using `setTimeout`) and then displays a "You're on the list!" success message without sending data to a server.
- **Scan Flow:** The interactive code scanner (`ScanMe.tsx`) relies entirely on local state and Framer Motion animations to simulate progress.

## 🔐 Accounts & Credentials

There are **no accounts, usernames, passwords, or authentication systems** built into this repository. It is a public-facing landing page design template. There is no dashboard or admin panel to log into.

## 💻 Getting Started

Follow these instructions to run the application locally:

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

1. Navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server (Start)

To start the local development server:
```bash
npm run dev
```
The server will start (typically at `http://localhost:5173`). Open this URL in your browser to view the landing page. The page will hot-reload automatically when you make changes to the code.

### Terminating the Server (End)

To stop the running development server, go to the terminal where it is running and press `Ctrl + C`.

### Building for Production

To create a production-ready build:
```bash
npm run build
```
This command compiles the application into static files within the `dist` directory, optimized for deployment.

