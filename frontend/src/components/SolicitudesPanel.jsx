import { useEffect, useState } from 'react';
import api from '../services/api';
// CAMBIO CLAVE: Agregamos Loader
import { Mail, Phone, Home, PawPrint, User, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';

const statusColors = {
    'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    'Aprobada': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    'Rechazada': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
};

export default function SolicitudesPanel() {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSolicitudes = async () => {
        setLoading(true);
        setError(null);
        try {
            // Llama a la nueva API
            const { data } = await api.get('/solicitudes');
            setSolicitudes(data);
        } catch (err) {
            setError('Error al cargar las solicitudes. Asegúrate de que el backend esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolicitudes();
    }, []);

    const handleUpdateStatus = async (id, nuevoEstado) => {
        if (!window.confirm(`¿Seguro que quieres cambiar el estado a "${nuevoEstado}"?`)) return;
        
        try {
            const { data } = await api.put(`/solicitudes/${id}`, { estado: nuevoEstado });
            
            // Actualizar la lista local
            setSolicitudes(prev => 
                prev.map(sol => sol._id === id ? data : sol)
            );
            alert(`Estado de solicitud actualizado a ${nuevoEstado}.`);

        } catch (error) {
            alert('Error al actualizar el estado.');
        }
    };

    if (loading) return <div className="text-center py-10 text-gray-500 dark:text-gray-400 flex items-center justify-center"><Loader className="animate-spin mr-3" /> Cargando solicitudes...</div>;
    if (error) return <div className="text-center py-10 text-red-500 font-bold">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8">Gestión de Solicitudes</h1>
            
            {solicitudes.length === 0 && (
                <div className="text-center py-20 text-gray-400 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                    Aún no hay solicitudes de adopción. ¡Todo limpio!
                </div>
            )}

            <div className="space-y-6">
                {solicitudes.map((sol) => (
                    <div key={sol._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-t-4 border-sage-500 dark:border-sage-400 transition-all hover:shadow-2xl">
                        
                        <div className="flex justify-between items-start mb-4">
                            {/* Información del Gato */}
                            <div className="flex items-center">
                                <img src={sol.gato.imagen} alt={sol.gato.nombre} className="w-16 h-16 object-cover rounded-full mr-4 border-2 border-sage-500" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{sol.gato.nombre}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <Clock size={12} /> Solicitud el {new Date(sol.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Estado Actual */}
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${statusColors[sol.estado]}`}>
                                {sol.estado}
                            </span>
                        </div>
                        
                        <hr className="my-4 border-gray-100 dark:border-gray-700" />

                        {/* Detalles del Adoptante */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 dark:text-gray-300">
                            <DetailItem icon={<User size={18}/>} label="Adoptante" value={sol.adoptante.nombre} />
                            <DetailItem icon={<Phone size={18}/>} label="Teléfono" value={sol.adoptante.telefono} isLink={`tel:${sol.adoptante.telefono}`} />
                            <DetailItem icon={<Mail size={18}/>} label="Email" value={sol.adoptante.email || 'N/A'} isLink={`mailto:${sol.adoptante.email}`} />
                            
                            <DetailItem icon={<Home size={18}/>} label="Vivienda" value={sol.aptitud.tipoVivienda} />
                            <DetailItem icon={<PawPrint size={18}/>} label="Otros Animales" value={sol.aptitud.convivenOtrosAnimales} />
                            <DetailItem icon={<User size={18}/>} label="Cuidador Principal" value={sol.aptitud.quienCuidara} />
                        </div>

                        {/* Mensaje */}
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Mensaje del Adoptante:</p>
                            <p className="text-gray-800 dark:text-gray-200 italic">"{sol.adoptante.mensaje}"</p>
                        </div>
                        
                        {/* Acciones del Admin */}
                        <div className="mt-6 flex gap-3 justify-end">
                            <button 
                                onClick={() => handleUpdateStatus(sol._id, 'Aprobada')}
                                disabled={sol.estado === 'Aprobada'}
                                className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                            >
                                <CheckCircle size={18} className="mr-2" /> Aprobar
                            </button>
                            <button 
                                onClick={() => handleUpdateStatus(sol._id, 'Rechazada')}
                                disabled={sol.estado === 'Rechazada'}
                                className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                            >
                                <XCircle size={18} className="mr-2" /> Rechazar
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

// Componente auxiliar para limpieza
const DetailItem = ({ icon, label, value, isLink }) => (
    <div className="flex items-center gap-2">
        <span className="text-sage-500 dark:text-sage-400">{icon}</span>
        <div>
            <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">{label}</p>
            {isLink ? (
                <a href={isLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-sage-600 dark:hover:text-sage-400 transition-colors">
                    {value}
                </a>
            ) : (
                <p className="text-sm font-medium">{value}</p>
            )}
        </div>
    </div>
);