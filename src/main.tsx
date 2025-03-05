
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Get the publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Create a fallback element to show when the key is missing
const MissingKeyFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md p-8 rounded-lg shadow-lg bg-card text-card-foreground">
      <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
      <p className="mb-4">
        Missing Clerk Publishable Key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.
      </p>
      <p className="text-sm text-muted-foreground">
        For development, you can create a .env file in the project root with this variable.
      </p>
    </div>
  </div>
)

// Check if the key is available
if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.")
  createRoot(document.getElementById("root")!).render(<MissingKeyFallback />);
} else {
  createRoot(document.getElementById("root")!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
}
