
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Get the publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Create root element
const rootElement = document.getElementById("root")!
const root = createRoot(rootElement)

// Render the app with or without ClerkProvider
if (!PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key. Authentication features will be disabled.")
  root.render(<App />)
} else {
  root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  )
}
