// backend/utils/emailUtils.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Configuración AUTOMÁTICA para Gmail
// Nodemailer se encargará de negociar el puerto correcto
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_HOST_USER, 
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
    // Opciones de depuración
    logger: true,
    debug: true
});

const sendApprovalEmail = async (adoptanteEmail, adoptanteNombre, gatoNombre) => {
    console.log(`📨 Intentando enviar correo a ${adoptanteEmail}...`);
    
    try {
        if (!adoptanteEmail) return false;

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_HOST_USER}>`,
            to: adoptanteEmail,
            subject: `🎉 ¡Felicidades! Solicitud Aprobada para ${gatoNombre}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4C7878;">¡Buenas noticias, ${adoptanteNombre}!</h2>
                    <p>Nos alegra informarte que tu solicitud para adoptar a <strong>${gatoNombre}</strong> ha sido <strong>APROBADA</strong>. 🐾</p>
                    <hr>
                    <p style="font-size: 12px; color: #777;">Refugio Katze</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ ¡CORREO ENVIADO! ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ ERROR CORREO:', error);
        return false;
    }
};

module.exports = { sendApprovalEmail };