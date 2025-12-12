// backend/utils/emailUtils.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// SI NO VES ESTE MENSAJE EN LOS LOGS, RENDER NO SE ACTUALIZÓ
console.log("🛠️ INICIANDO SISTEMA DE CORREO - VERSIÓN DEFINITIVA 🛠️");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_HOST_USER, 
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    },
    // ESTO ES LO QUE ARREGLA EL ERROR:
    family: 4 
});

const sendApprovalEmail = async (adoptanteEmail, adoptanteNombre, gatoNombre) => {
    console.log(`📨 Intentando enviar correo a ${adoptanteEmail}...`);
    
    try {
        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_HOST_USER}>`,
            to: adoptanteEmail,
            subject: `🎉 ¡Felicidades! Solicitud Aprobada para ${gatoNombre}`,
            html: `<p>¡Felicidades ${adoptanteNombre}! Has sido aprobado para adoptar a ${gatoNombre}.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ ¡CORREO ENVIADO! ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ ERROR:', error);
        return false;
    }
};

module.exports = { sendApprovalEmail };