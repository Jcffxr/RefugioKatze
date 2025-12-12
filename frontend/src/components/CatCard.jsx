import { Heart, Venus, Mars } from 'lucide-react';

export default function CatCard({ gato, onAdopt }) {
  const esMacho = gato.sexo === 'Macho';

  // Función para elegir el color según el estado
  const renderBadge = () => {
    switch (gato.estado) {
      case 'Disponible':
        return <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">🟢 Disponible</span>;
      case 'En Proceso':
        return <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">🟠 En Proceso</span>;
      case 'Adoptado':
        return <span className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">🔴 Adoptado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2 flex flex-col h-full">
      
      {/* Imagen */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img 
          src={gato.imagen} 
          alt={gato.nombre} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* ETIQUETA INTELIGENTE */}
        <div className="absolute top-4 right-4">
          {renderBadge()}
        </div>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-sage-600 dark:group-hover:text-sage-400 transition-colors flex items-center gap-2">
              {gato.nombre}
              {gato.sexo && (
                <span className={`p-1 rounded-full flex items-center justify-center ${esMacho ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300'}`}>
                  {esMacho ? <Mars size={16} /> : <Venus size={16} />}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{gato.edad}</p>
          </div>
          <button className="p-2 rounded-full bg-sage-50 dark:bg-gray-700 text-sage-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-600 transition-colors">
            <Heart size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {gato.etiquetas && gato.etiquetas.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-sage-50 dark:bg-gray-700 text-sage-700 dark:text-sage-300 text-xs rounded-lg font-medium border border-transparent dark:border-gray-600">
              {tag}
            </span>
          ))}
        </div>

        {/* Botón (Deshabilitado si está adoptado) */}
        <button 
          onClick={gato.estado === 'Disponible' ? onAdopt : null}
          disabled={gato.estado !== 'Disponible'}
          className={`mt-auto w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95
            ${gato.estado === 'Disponible' 
              ? 'bg-sage-600 hover:bg-sage-700 text-white shadow-sage-500/20' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {gato.estado === 'Disponible' ? `Conocer a ${gato.nombre}` : 'No disponible'}
        </button>
      </div>
    </div>
  );
}