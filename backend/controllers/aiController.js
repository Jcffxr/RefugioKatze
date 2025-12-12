const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

// Inicializar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generarDescripcion = async (req, res) => {
    try {
        const { nombre, etiquetas, edad } = req.body;

        if (!nombre || !etiquetas) {
            return res.status(400).json({ message: 'Faltan datos para generar la historia' });
        }

        // Configurar el modelo (usamos gemini-flash-latest que es rápido y bueno para texto)
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // El Prompt (La instrucción maestra)
        const prompt = `
            Eres un experto en adopción de animales y copywriter emocional.
            Escribe una biografía breve, tierna y atractiva para un gato en adopción.
            
            Datos del gato:
            - Nombre: ${nombre}
            - Edad: ${edad} años
            - Personalidad/Etiquetas: ${etiquetas}
            
            Reglas:
            - Usa emojis.
            - Máximo 3 o 4 líneas.
            - El tono debe ser esperanzador y llamar a la acción de adoptar.
            - No pongas títulos, solo el texto de la historia.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textoGenerado = response.text();

        res.json({ descripcion: textoGenerado });

    } catch (error) {
        console.error("Error IA:", error);
        res.status(500).json({ message: 'La IA se mareó y no pudo escribir.' });
    }
};

module.exports = { generarDescripcion };