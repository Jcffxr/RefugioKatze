// backend/utils/emailUtils.js

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// 🚨 CAMBIO IMPORTANTE: Usamos host y puerto explícitos para evitar bloqueos en Render
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_HOST_USER, 
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false // Ayuda a evitar errores de certificados en algunos servidores
    }
});

const sendApprovalEmail = async (adoptanteEmail, adoptanteNombre, gatoNombre) => {
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
                    <p>Pronto nos pondremos en contacto contigo al teléfono registrado para coordinar los siguientes pasos.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #777;">Atentamente,<br/>El equipo de ${process.env.EMAIL_FROM_NAME}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email enviado correctamente a ${adoptanteEmail}`);
        return true;
    } catch (error) {
        // Aquí verás el error real si vuelve a fallar
        console.error('❌ Error enviando email:', error);
        return false;
    }
};

module.exports = { sendApprovalEmail };