// backend/utils/emailUtils.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

console.log("🔒 INTENTANDO CONEXIÓN SEGURA SSL (PUERTO 465)...");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Host manual
    port: 465,               // 🚨 PUERTO SSL (La puerta trasera)
    secure: true,            // 🚨 TIENE QUE SER TRUE para el puerto 465
    auth: {
        user: process.env.EMAIL_HOST_USER, 
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
    // Esto ayuda si el certificado de seguridad es estricto
    tls: {
        rejectUnauthorized: false
    }
});

const sendApprovalEmail = async (adoptanteEmail, adoptanteNombre, gatoNombre) => {
    console.log(`📨 Enviando a: ${adoptanteEmail} vía SSL...`);
    
    try {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_HOST_USER}>`,
            to: adoptanteEmail,
            subject: `🎉 ¡Felicidades! Solicitud Aprobada para ${gatoNombre}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4C7878;">¡Buenas noticias, ${adoptanteNombre}!</h2>
                    <p>Tu solicitud para adoptar a <strong>${gatoNombre}</strong> ha sido APROBADA.</p>
                    <hr>
                    <p style="font-size: 12px; color: #777;">Refugio Katze</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ ¡ENVIADO POR SSL! ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ FALLÓ SSL:', error);
        return false;
    }
};

module.exports = { sendApprovalEmail };