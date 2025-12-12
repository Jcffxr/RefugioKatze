const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Configuración de Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_HOST_USER, 
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
});

const sendApprovalEmail = async (adoptanteEmail, adoptanteNombre, gatoNombre) => {
    try {
        if (!adoptanteEmail) return false;

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_HOST_USER}>`,
            to: adoptanteEmail,
            subject: `🎉 ¡Felicidades! Solicitud Aprobada para ${gatoNombre}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #4C7878;">¡Buenas noticias, ${adoptanteNombre}!</h2>
                    <p>Tu solicitud para adoptar a <strong>${gatoNombre}</strong> ha sido APROBADA.</p>
                    <p>Nos pondremos en contacto contigo pronto al teléfono que nos proporcionaste para coordinar la entrega.</p>
                    <hr/>
                    <p style="font-size: 12px; color: #777;">Refugio Katze</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email enviado a ${adoptanteEmail}`);
        return true;
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        return false;
    }
};

module.exports = { sendApprovalEmail };