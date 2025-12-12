import { Link } from 'react-router-dom';
import { LogIn, LogOut, Cat, LayoutDashboard } from 'lucide-react'; 
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO KATZE */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-sage-600 dark:text-sage-400 hover:opacity-80 transition-opacity">
          <Cat size={32} className="transform rotate-12"/>
          <span>Katze Refugio</span>
        </Link>
        
        {/* BOTONES DERECHA */}
        <div className="flex items-center space-x-4">
          
          {/* 1. Botón de Modo Oscuro */}
          <ThemeToggle />
          
          {/* 2. Botón de Administración */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Link 
                to="/admin" 
                className="flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-sage-600 hover:bg-sage-700 transition-colors shadow-md shadow-sage-500/30"
              >
                 <LayoutDashboard size={18} className="mr-2"/>
                Dashboard
              </Link>
              <button 
                onClick={logout} 
                className="flex items-center p-2 rounded-full text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white bg-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-opacity shadow-md"
            >
              <LogIn size={18} className="mr-2" />
              Soy Admin
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}