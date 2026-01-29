# CyberGuard Client

Enterprise-grade frontend interface for the CyberGuard threat intelligence platform.

## 🛠 Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **HTTP Client**: Axios (Modularized via `src/lib/api.js`)

## 🚀 Development Setup

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Create a `.env` file in this directory to override defaults:

    ```ini
    VITE_API_URL=http://localhost:5000
    ```

3.  **Start Dev Server**
    ```bash
    npm run dev
    # Runs on http://localhost:5173
    ```

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components (ThreatScanner, ScanResult)
├── context/      # Global state (AuthContext)
├── hooks/        # Custom hooks (useAuth)
├── lib/          # Utilities and configurations (api.js)
├── pages/        # Route views (Login, Dashboard)
└── index.css     # Global styles & Tailwind directives
```

## 🧪 Best Practices used

- **DRY API Logic**: Centralized Axios instance with interceptors.
- **Component Composition**: Strict separation of concerns.
- **Atomic Design**: Small, focused components.
