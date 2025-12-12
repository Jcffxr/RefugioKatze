import { X, Send, Quote, Venus, Mars, Loader } from 'lucide-react'; 
import { useState } from 'react';
import api from '../services/api';

export default function AdoptionModal({ gato, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '', 
    telefono: '', 
    email: '',
    mensaje: `Hola, me enamoré de ${gato.nombre} y quisiera adoptarlo/a.`,
    tipoVivienda: 'Departamento',
    convivenOtrosAnimales: 'No',
    quienCuidara: 'Yo',
  });
  const [enviando, setEnviando] = useState(false);
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const esMacho = gato.sexo === 'Macho';

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setEnviando(true);
    
    const solicitudData = {
      gatoId: gato._id,
      gatoNombre: gato.nombre,
      adoptante: {
        nombre: formData.nombre,
        telefono: formData.telefono,
        email: formData.email,
        mensaje: formData.mensaje,
      },
      aptitud: {
        tipoVivienda: formData.tipoVivienda,
        convivenOtrosAnimales: formData.convivenOtrosAnimales,
        quienCuidara: formData.quienCuidara,
      }
    };

    try {
        const response = await api.post('/solicitudes', solicitudData);
        // 2. MOSTRAR MENSAJE BASADO EN LA RESPUESTA DE LA IA
        if (response.data.estado === 'Rechazada') {
            alert('🚫 Solicitud Pre-Rechazada: Lamentamos informarte que tu perfil no cumple con los requisitos básicos de aptitud. Esto fue un rechazo automático del sistema. Por favor, revisa las condiciones de vivienda y cuidado.');
            onClose(); // Cerrar el modal para que intente de nuevo más tarde si quiere
        } else {
            setSolicitudEnviada(true); // Mostrar pantalla de éxito estándar si es PENDIENTE
        }
    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        alert('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.');
    } finally {
        setEnviando(false);
    }
  };

  if (solicitudEnviada) {
      return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl p-8 text-center border border-sage-200 dark:border-gray-700">
                <h2 className="text-4xl font-extrabold text-sage-600 dark:text-sage-400 mb-4">¡Gracias por tu Solicitud!</h2>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">Hemos recibido tu interés en **{gato.nombre}**.</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Nuestro equipo revisará cuidadosamente tu perfil de aptitud. Te contactaremos 
                    al teléfono o correo proporcionado en las próximas 48 horas. ¡Tu nuevo amigo te espera! 🐾
                </p>
                <button 
                    onClick={onClose} 
                    className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl transition-transform hover:scale-[1.02] shadow-lg"
                >
                    Cerrar
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all flex flex-col md:flex-row max-h-[90vh]">
        
        {/* FOTO */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto shrink-0">
          <img src={gato.imagen} alt={gato.nombre} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full md:hidden backdrop-blur-md">
            <X size={24} />
          </button>
        </div>

        {/* FORMULARIO */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white dark:bg-gray-900 scrollbar-hide">
          <button onClick={onClose} className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X size={28} />
          </button>

          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Adopta a {gato.nombre}</h2>
            {gato.sexo && (
                <span className={`p-1.5 rounded-full flex items-center justify-center ${esMacho ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300'}`}>
                  {esMacho ? <Mars size={20} /> : <Venus size={20} />}
                </span>
            )}
          </div>

          <p className="text-sage-600 dark:text-sage-400 text-sm font-bold mt-1 uppercase tracking-wide mb-6">{gato.edad}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TÍTULO DEL FORMULARIO */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">1. Tus Datos de Contacto</h3>
            
            {/* Datos de Contacto */}
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Tu Nombre" name="nombre" type="text" placeholder="Jefferson" value={formData.nombre} onChange={handleChange} required />
                <InputGroup label="Tu Teléfono" name="telefono" type="tel" placeholder="650..." value={formData.telefono} onChange={handleChange} required />
            </div>
            <InputGroup label="Tu Email (Opcional)" name="email" type="email" placeholder="ejemplo@correo.com" value={formData.email} onChange={handleChange} />
            
            <InputGroup label="Mensaje Inicial" name="mensaje" isTextarea placeholder="Hola, me gustaría saber más..." value={formData.mensaje} onChange={handleChange} />
            
            {/* TÍTULO DE APTITUD */}
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 pt-4">2. Requisitos de Aptitud</h3>

            {/* Requisitos de Aptitud */}
            <SelectGroup label="Tipo de Vivienda" name="tipoVivienda" value={formData.tipoVivienda} onChange={handleChange}>
                <option value="Casa">Casa con patio</option>
                <option value="Departamento">Departamento (sin patio)</option>
                <option option="Otro">Otro</option>
            </SelectGroup>

            <SelectGroup label="Conviven otros animales en casa?" name="convivenOtrosAnimales" value={formData.convivenOtrosAnimales} onChange={handleChange}>
                <option value="No">No, sería mi única mascota</option>
                <option value="SiGatos">Sí, otros gatos</option>
                <option value="SiPerros">Sí, perros</option>
                <option value="SiMixto">Sí, otros tipos</option>
            </SelectGroup>

            <SelectGroup label="Quién se hará cargo principal del cuidado?" name="quienCuidara" value={formData.quienCuidara} onChange={handleChange}>
                <option value="Yo">Yo (Adoptante principal)</option>
                <option value="MiFamilia">Mi familia/Compañeros de piso</option>
            </SelectGroup>


            <button type="submit" disabled={enviando} className="w-full py-4 bg-sage-600 hover:bg-sage-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-sage-500/20 active:scale-95">
              {enviando ? <><Loader size={20} className="animate-spin" /> Enviando Solicitud...</> : <><Send size={20} /> Enviar Solicitud</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Estilos de Input (Consistente con Admin.jsx)
const inputStyle = "w-full p-3 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400 font-medium";
const labelStyle = "text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider";

// Componentes Reutilizables para limpiar el código
const InputGroup = ({ label, name, isTextarea, ...props }) => (
    <div className="flex flex-col gap-2">
        <label className={labelStyle}>{label}</label>
        {isTextarea ? (
            <textarea name={name} className={`${inputStyle} h-24 resize-none`} {...props}></textarea>
        ) : (
            <input name={name} className={inputStyle} {...props} />
        )}
    </div>
);

const SelectGroup = ({ label, name, children, ...props }) => (
    <div className="flex flex-col gap-2">
        <label className={labelStyle}>{label}</label>
        <select name={name} className={`${inputStyle} p-3`} {...props}>
            {children}
        </select>
    </div>
);