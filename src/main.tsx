
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root element
const rootElement = document.getElementById("root")!
const root = createRoot(rootElement)

// Add console log to check rendering
console.log('Rendering App component')

// Render the app directly without ClerkProvider
root.render(<App />)
