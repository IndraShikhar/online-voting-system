import { createRoot } from 'react-dom/client'
import AppRouter from './App.jsx'
import { AuthProvider } from '../src/auth/AuthContext.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <Toaster/>
       <AppRouter/>
    </AuthProvider>
)
