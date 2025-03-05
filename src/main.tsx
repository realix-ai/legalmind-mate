
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Get the publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if the key is available
if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key. Set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.")
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY || 'pk_test_placeholder_for_development'}>
    <App />
  </ClerkProvider>
);
