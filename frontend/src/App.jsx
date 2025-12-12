import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import ThemeToggle from './components/ThemeToggle'; 
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; 
// import { LayoutDashboard } from 'lucide-react'; // Ya no se necesita si usamos el botón de Soy Admin

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* <ThemeToggle /> */}
        {/* // ❌ COMENTAR O ELIMINAR: El botón flotante de Admin se reemplazará por el Navbar
        <Link 
          to="/admin" 
          className="fixed bottom-5 right-5 z-40 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
          title="Ir al Admin"
        >
          <LayoutDashboard size={24} />
        </Link>
        */}

        {/* 🚀 EL NAVBAR SE AÑADIRÁ DENTRO DE Home.jsx */}

        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas Protegidas (Solo con Login) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}