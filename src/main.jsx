import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '9999px',
            background: 'rgba(28, 28, 30, 0.92)',
            color: '#fff',
            backdropFilter: 'blur(20px)',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#fff' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)