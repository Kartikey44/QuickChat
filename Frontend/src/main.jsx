import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext.jsx'
import { ChatProvider } from './context/chatcontext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChatProvider>
  <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>,
      </AuthProvider>
      </ChatProvider>
</BrowserRouter>
)
