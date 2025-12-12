import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { 
  Upload, Cat, Trash2, LogOut, LayoutGrid, PlusCircle, PenTool, X, Sparkles, Loader, Venus, Mars, MessageSquare 
} from 'lucide-react';
import SolicitudesPanel from '../components/SolicitudesPanel';
import ThemeToggle from '../components/ThemeToggle'; // <-- IMPORTADO EL TOGGLE

export default function Admin() {
  const { logout, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('solicitudes'); // <-- Inicia en Solicitudes
  const [gatos, setGatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [gatoEditando, setGatoEditando] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '', edad: '', sexo: 'Macho', etiquetas: '', descripcion: ''
  });
  const [file, setFile] = useState(null);

  const fetchGatos = async () => {
    try { const { data } = await api.get('/gatos'); setGatos(data); } 
    catch (error) { console.error('Error cargando gatos'); }
  };
  useEffect(() => { fetchGatos(); }, []);

  const handleGenerateAI = async () => {
    if (!formData.nombre || !formData.etiquetas) { alert('⚠️ Faltan datos para la IA.'); return; }
    setGeneratingAI(true);
    try {
      const { data } = await api.post('/ai/generar', {
        nombre: formData.nombre, edad: formData.edad, etiquetas: formData.etiquetas
      });
      setFormData(prev => ({ ...prev, descripcion: data.descripcion }));
    } catch (error) { alert('Error en la IA.'); } finally { setGeneratingAI(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('edad', formData.edad);
      data.append('sexo', formData.sexo);
      data.append('descripcion', formData.descripcion);
      data.append('imagen', file);
      const etiquetasArray = formData.etiquetas.split(',').map(tag => tag.trim());
      data.append('etiquetas', JSON.stringify(etiquetasArray));
      await api.post('/gatos', data, { headers: { 'Content-Type': 'multipart/form-data' }});
      alert('¡Guardado!'); setFormData({ nombre: '', edad: '', sexo: 'Macho', etiquetas: '', descripcion: '' }); setFile(null); fetchGatos(); setActiveTab('inventario'); 
    } catch (error) { alert('Error al subir.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Borrar? 🗑️')) return;
    try { await api.delete(`/gatos/${id}`); fetchGatos(); } catch (error) { alert('Error'); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/gatos/${gatoEditando._id}`, {
        nombre: gatoEditando.nombre, edad: gatoEditando.edad, sexo: gatoEditando.sexo, descripcion: gatoEditando.descripcion,
      });
      alert('¡Corregido!'); setGatoEditando(null); fetchGatos();
    } catch (error) { alert('Error al actualizar'); }
  };

  const toggleEstado = async (gato) => {
    let nuevoEstado;
    if (gato.estado === 'Disponible') {
      nuevoEstado = 'En Proceso';
    } else if (gato.estado === 'En Proceso') {
      nuevoEstado = 'Adoptado';
    } else {
      nuevoEstado = 'Disponible';
    }

    try { await api.put(`/gatos/${gato._id}`, { estado: nuevoEstado }); fetchGatos(); } catch (error) { alert('Error al cambiar estado'); }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
        
        {/* TOGGLE MODO OSCURO EN ADMIN (FIJO) */}
        <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
        </div>

      <aside className="w-20 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between fixed h-full z-10 transition-all">
        <div>
          <div className="p-6 flex items-center gap-3 text-sage-600 dark:text-sage-400 font-bold text-xl"><Cat size={28} /><span className="hidden md:inline">AdminPanel</span></div>
          <nav className="mt-8 space-y-2 px-4">
            {/* SOLICITUDES - NUEVA PESTAÑA */}
            <button onClick={() => setActiveTab('solicitudes')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'solicitudes' ? 'bg-sage-100 text-sage-700 dark:bg-gray-700 dark:text-sage-300 font-bold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'}`}><MessageSquare size={20} /> <span className="hidden md:inline">Solicitudes</span></button>
            
            <button onClick={() => setActiveTab('inventario')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'inventario' ? 'bg-sage-100 text-sage-700 dark:bg-gray-700 dark:text-sage-300 font-bold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'}`}><LayoutGrid size={20} /> <span className="hidden md:inline">Inventario</span></button>
            <button onClick={() => setActiveTab('subir')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'subir' ? 'bg-sage-100 text-sage-700 dark:bg-gray-700 dark:text-sage-300 font-bold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'}`}><PlusCircle size={20} /> <span className="hidden md:inline">Nuevo Gato</span></button>
          </nav>
        </div>
        <div className="p-4"><button onClick={logout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors font-medium"><LogOut size={20} /> <span className="hidden md:inline">Cerrar Sesión</span></button></div>
      </aside>

      <main className="flex-1 ml-20 md:ml-64 p-8 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        
        {/* RENDERIZADO CONDICIONAL */}
        {activeTab === 'solicitudes' && <SolicitudesPanel />}

        {activeTab === 'inventario' && (
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-8">Inventario</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gatos.map((gato) => (
                <div key={gato._id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group">
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                    <img src={gato.imagen} alt={gato.nombre} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setGatoEditando(gato)} className="p-2 bg-white/90 dark:bg-gray-700 rounded-full text-gray-700 dark:text-white hover:text-sage-600 shadow-sm backdrop-blur-sm"><PenTool size={14} /></button>
                      <button onClick={() => handleDelete(gato._id)} className="p-2 bg-white/90 dark:bg-gray-700 rounded-full text-gray-700 dark:text-white hover:text-red-500 shadow-sm backdrop-blur-sm"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{gato.nombre}</h3>
                        {gato.sexo && (
                          <span className={`text-xs p-1 rounded-full ${gato.sexo === 'Macho' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300'}`}>
                           {gato.sexo === 'Macho' ? <Mars size={12}/> : <Venus size={12}/>}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{gato.edad}</p>
                    </div>
                    <button onClick={() => toggleEstado(gato)} className={`px-3 py-1 rounded-full text-xs font-bold border ${gato.estado === 'Disponible' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : gato.estado === 'En Proceso' ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'}`}>{gato.estado}</button>
                  </div>
                </div>
              ))}
            </div>
            {gatos.length === 0 && <div className="text-center py-20 text-gray-400">Aún no hay gatos. Ve a "Nuevo Gato" para empezar.</div>}
          </div>
        )}

        {activeTab === 'subir' && (
          <div className="max-w-2xl mx-auto animate-fadeIn">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Nuevo Rescatado</h1>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* FILA 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className={labelAdmin}>Nombre</label>
                    <input type="text" className={inputAdmin} placeholder="Ej: Mochi" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelAdmin}>Edad</label>
                    <input type="text" className={inputAdmin} placeholder="Ej: 3 meses" value={formData.edad} onChange={(e) => setFormData({...formData, edad: e.target.value})} required />
                  </div>
                </div>

                {/* FILA 2 - Sexo */}
                <div className="flex flex-col gap-2">
                  <label className={labelAdmin}>Sexo</label>
                  <select className={inputAdmin} value={formData.sexo} onChange={(e) => setFormData({...formData, sexo: e.target.value})}>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>

                {/* FILA 3 - Etiquetas */}
                <div className="flex flex-col gap-2">
                  <label className={labelAdmin}>Etiquetas</label>
                  <input type="text" className={inputAdmin} placeholder="Ej: Juguetón, Cariñoso" value={formData.etiquetas} onChange={(e) => setFormData({...formData, etiquetas: e.target.value})} />
                </div>
                
                {/* FILA 4 - Descripcion + IA */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className={labelAdmin}>Descripción</label>
                    <button type="button" onClick={handleGenerateAI} disabled={generatingAI} className={btnAi}>
                      {generatingAI ? <><Loader size={12} className="animate-spin"/> Escribiendo...</> : <><Sparkles size={12} /> Generar con IA</>}
                    </button>
                  </div>
                  <textarea className={`${inputAdmin} h-32 resize-none`} placeholder="Historia conmovedora..." value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})}></textarea>
                </div>

                {/* FILA 5 - Foto */}
                <div className="border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <input type="file" id="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
                  <label htmlFor="file" className="cursor-pointer text-sage-600 dark:text-sage-400 font-bold hover:text-sage-500 flex flex-col items-center gap-2">
                    <Upload size={30}/> {file ? file.name : 'Click para subir foto'}
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-sage-600 hover:bg-sage-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-sage-500/20 active:scale-95">
                  {loading ? 'Subiendo...' : 'Publicar Mascota'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* MODAL EDICIÓN */}
      {gatoEditando && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-scaleIn border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Editar</h2>
              <button onClick={() => setGatoEditando(null)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex flex-col gap-2"><label className={labelAdmin}>Nombre</label><input type="text" className={inputAdmin} value={gatoEditando.nombre} onChange={(e) => setGatoEditando({...gatoEditando, nombre: e.target.value})} /></div>
              <div className="flex flex-col gap-2"><label className={labelAdmin}>Edad</label><input type="text" className={inputAdmin} value={gatoEditando.edad} onChange={(e) => setGatoEditando({...gatoEditando, edad: e.target.value})} /></div>
              <div className="flex flex-col gap-2"><label className={labelAdmin}>Sexo</label><select className={inputAdmin} value={gatoEditando.sexo} onChange={(e) => setGatoEditando({...gatoEditando, sexo: e.target.value})}><option value="Macho">Macho</option><option value="Hembra">Hembra</option></select></div>
              <div className="flex flex-col gap-2"><label className={labelAdmin}>Historia</label><textarea className={`${inputAdmin} h-24 resize-none`} value={gatoEditando.descripcion} onChange={(e) => setGatoEditando({...gatoEditando, descripcion: e.target.value})}></textarea></div>
              <button type="submit" className="w-full py-3 bg-sage-600 hover:bg-sage-500 text-white font-bold rounded-xl shadow-lg">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ESTILOS DE ALTA FIDELIDAD
const labelAdmin = "block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider";
const inputAdmin = "w-full p-3 bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-sage-500 focus:border-sage-500 outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400";
const btnAi = "flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-xs font-bold rounded-full transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed";