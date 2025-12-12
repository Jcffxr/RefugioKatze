import { useEffect, useState } from 'react';
import api from '../services/api';
import CatCard from '../components/CatCard';
import AdoptionModal from '../components/AdoptionModal';
import Navbar from '../components/Navbar';

export default function Home() {
  const [gatos, setGatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gatoSeleccionado, setGatoSeleccionado] = useState(null);

  useEffect(() => {
    const fetchGatos = async () => {
      try {
        const { data } = await api.get('/gatos');
        setGatos(data);
      } catch (error) {
        console.error('Error cargando gatos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGatos();
  }, []);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 transition-colors duration-300">
      
      <Navbar /> 
      
      {/* --- HERO SECTION (Diseño TOP Azul Profundo y Alto Contraste) --- */}
      {/* El color de fondo fijo #181a3d (Azul Marino) soluciona el problema de "white-out" */}
      <div className="bg-[#181a3d] dark:bg-[#181a3d] text-white pt-20 pb-32 px-4 text-center transition-colors duration-300">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* TÍTULO ENORME Y ATRACTIVO */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
            Salva una vida, 
            {/* Color de énfasis Cyan, legible sobre fondo oscuro */}
            <span className="text-cyan-400 dark:text-cyan-300 block sm:inline ml-0 md:ml-4">gana un amigo.</span>
          </h1>
          
          {/* DESCRIPCIÓN CON ÉNFASIS */}
          <p className="text-xl text-gray-200 dark:text-gray-300 max-w-xl mx-auto">
            En Katze, cada adopción es una historia de amor. Miles de colitas están esperando a alguien como tú. 🏡✨
          </p>
          
          <div className="pt-6">
             {/* Botón Principal - Usamos el color Sage de la marca */}
             <a href="#galeria" className="inline-block px-10 py-4 bg-sage-500 hover:bg-sage-600 text-white font-extrabold rounded-full text-lg shadow-2xl shadow-sage-500/30 hover:scale-105 transition-transform duration-300 transform hover:-translate-y-1 active:scale-100">
                Ver Colitas Disponibles
            </a>
          </div>

        </div>
      </div>

      {/* Galería Grid */}
      <div id="galeria" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-10 flex items-center gap-3">
          <span className="w-2 h-8 bg-sage-500 rounded-full"></span>
          Nuestros Rescatados
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando michis...</p>
        ) : gatos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gatos.map((gato) => (
              <CatCard 
                key={gato._id} 
                gato={gato} 
                onAdopt={() => setGatoSeleccionado(gato)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Aún no hay gatos publicados. ¡Ve al Dashboard! 😺
            </p>
          </div>
        )}
      </div>

      {gatoSeleccionado && (
        <AdoptionModal 
          gato={gatoSeleccionado} 
          onClose={() => setGatoSeleccionado(null)} 
        />
      )}

    </div>
  );
}