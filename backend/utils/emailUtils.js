// backend/utils/emailUtils.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// 1. Imprimir configuración en consola para verificar que Render actualizó el código
console.log("📧 CONFIGURANDO TRANSPORTE DE EMAIL...");
console.log(`📧 HOST: smtp.gmail.com | PORT: 587 | USER: ${process.env.EMAIL_HOST_USER}`);

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Usamos el host directo
    port: 587,              // Puerto estándar TLS (El único que Render permite seguro)
    secure: false,          // OBLIGATORIO false para puerto 587
    auth: {
        user: process.env.EMAIL_HOST_USER, 
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false, // Ignorar errores de certificado
        ciphers: 'SSLv3'
    },
    // 🚨 MODO DETECTIVE ACTIVADO 🚨
    logger: true, // Imprimirá info en los logs de Render
    debug: true   // Imprimirá datos de la conexión
});

const sendApprovalEmail = async (adoptanteEmail, adoptanteNombre, gatoNombre) => {
    try {
        console.log(`🚀 Iniciando envío a: ${adoptanteEmail}`);
        
        if (!adoptanteEmail) {
            console.error("❌ No hay email destinatario");
            return false;
        }

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
        console.log(`✅ Email enviado! ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ Error FATAL enviando email:', error);
        return false;
    }
};

module.exports = { sendApprovalEmail };