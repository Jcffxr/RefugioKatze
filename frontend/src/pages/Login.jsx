import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Agregamos Link para ir al home
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Cat, Loader, LogIn, ArrowLeft } from 'lucide-react'; // Agregamos ArrowLeft
import ThemeToggle from '../components/ThemeToggle'; 

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/users/login', { email, password });
            login(data.token);
            navigate('/admin');
        } catch (err) {
            setError('Credenciales incorrectas. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300 relative">
            
            {/* TOGGLE MODO OSCURO EN LOGIN (FIJO) */}
            <div className="absolute top-6 right-6 z-10">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                
                {/* Botón de regreso al Home */}
                <Link to="/" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-sage-600 transition-colors text-sm font-semibold">
                    <ArrowLeft size={18} className="mr-1" /> Volver al Refugio
                </Link>

                <div className="flex flex-col items-center">
                    <Cat size={48} className="text-sage-600 dark:text-sage-400 mb-2" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acceso de Administrador</h2>
                </div>
                
                {error && (
                    <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-3 rounded-xl border border-red-200 dark:border-red-800 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label className="label-login">Email</label>
                        <input
                            type="email"
                            required
                            className={inputLogin}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@refugio.com"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="label-login">Contraseña</label>
                        <input
                            type="password"
                            required
                            className={inputLogin}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-sage-600 hover:bg-sage-700 disabled:opacity-50 transition-colors active:scale-[0.99]"
                    >
                        {loading ? <Loader size={20} className="animate-spin" /> : <><LogIn size={20} className="mr-2" /> Entrar</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

// Estilos de Input y Label para Login (Alto Contraste)
const labelLogin = "text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider";
const inputLogin = "w-full p-3 bg-white dark:bg-gray-700 border border-gray-400 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none transition-colors placeholder-gray-500 dark:placeholder-gray-400";