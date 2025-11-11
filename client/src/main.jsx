import { createRoot } from 'react-dom/client'
import AppRouter from './App.jsx'
import { AuthProvider } from '../src/auth/AuthContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
       <AppRouter/>
    </AuthProvider>
)
