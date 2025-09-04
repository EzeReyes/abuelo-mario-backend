import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// 🛡️ CORS configurado para desarrollo local
app.use(cors({
  origin: 'https://abuelomario.com.ar',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 📬 Configuración del transporte SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // ✅ Esto simplifica el uso de Gmail
  auth: {
    user: process.env.GMAIL_USER, // tu dirección Gmail
    pass: process.env.GMAIL_PASS  // tu contraseña o App Password
  }
});

// 📩 Ruta para recibir y enviar el formulario
app.post('/api/contact', async (req, res) => {
  const { nombre, email, mensaje, telefono } = req.body;

  const mailOptions = {
    from: `"Formulario Abuelo Mario" <${email}>`,
    to: process.env.GMAIL_USER,
    subject: `Nuevo mensaje de contacto del usuario ${email}`,
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #fdf6ec; color: #333; padding: 2rem; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #b48b5f; font-size: 2rem; margin-bottom: 1rem;">Nuevo mensaje de contacto</h1>
      <p style="font-size: 1.1rem; line-height: 1.6;"><strong>Nombre del usuario:</strong> ${nombre}</p>
      <p style="font-size: 1.1rem; line-height: 1.6;"><strong>Email:</strong> ${email}</p>
      <p style="font-size: 1.1rem; line-height: 1.6;"><strong>Teléfono:</strong> ${telefono}</p>
      <p style="font-size: 1.1rem; line-height: 1.6;"><strong>Mensaje:</strong><br/>${mensaje}</p>

      <div style="text-align: center;">
        <span style="font-style: italic; font-size: 1.8rem; color: #000; text-shadow: 1px 1px 2px #d4af37;">ABUELO MARIO</span>
      </div>

      <div style="font-size: 0.9rem; color: #555; text-align: center;">
        <p>Contacto: +54 9 223 595-0860</p>
        <p>7600, Mar del Plata, Buenos Aires, Argentina</p>
      </div>

      <div style="text-align: center; margin-top: 1rem;">
        <p style="text-decoration: underline; text-shadow: 1px 1px 2px white, 0 0 1em blue, 0 0 0.2em blue;">Seguinos en redes</p>
      </div>

      <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin: auto;">
        <tr>
          <td align="center" style="padding: 0 15px;">
            <a href="https://wa.me/5492235950860" title="WhatsApp" target="_blank" rel="noopener noreferrer">
              <img src="https://res.cloudinary.com/dbctwitmb/image/upload/c_thumb,w_200,g_face/v1757003529/mdQNdcFMi0p_eqlwnk.png" alt="WhatsApp" width="auto" height="50" style="display: block;" />
            </a>
          </td>
          <td align="center" style="padding: 0 15px;">
            <a href="https://www.instagram.com/abuelo_mario777" title="Instagram" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width="40" height="40" style="display: block;" />
            </a>
          </td>
        </tr>
      </table>

      <div style="margin-top: 2rem; font-size: 0.9rem; color: #777; text-align: center;">
        © Abuelo Mario · Productos para barbería con historia
      </div>
    </div>
    `
  };

  const autoReplyOptions = {
    from: `"Abuelo Mario" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '¡Gracias por tu mensaje!',
    html: `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #fdf6ec; color: #333; padding: 2rem; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #b48b5f; font-size: 2rem; margin-bottom: 1rem;">Bienvenido a Abuelo Mario</h1>
      <p style="font-size: 1.1rem; line-height: 1.6;">
        Hemos recibido tu mensaje correctamente. A la brevedad responderemos tu consulta con la atención que merecés.
      </p>
      <p style="font-size: 1.1rem; line-height: 1.6;">
        Gracias por confiar en nuestros productos para el cuidado personal. En Abuelo Mario valoramos la autenticidad, la tradición y el estilo.
      </p>

      <div style="text-align: center;">
        <span style="font-style: italic; text-align: center; font-size: 1.8rem; color: #000; text-shadow: 1px 1px 2px #d4af37;">ABUELO MARIO</span>
      </div>

      <div style="font-size: 0.9rem; color: #555; text-align: center;">
        <p>Contacto: +54 9 223 595-0860</p>
        <p>7600, Mar del Plata, Buenos Aires, Argentina</p>
      </div>

      <div style="text-align: center; margin-top: 1rem;">
        <p style="text-decoration: underline; text-shadow: 1px 1px 2px white, 0 0 1em blue, 0 0 0.2em blue;">Seguinos en redes</p>
      </div>

      <table align="center" cellpadding="0" cellspacing="0" role="presentation" style="margin: auto;">
        <tr>
          <td align="center" style="padding: 0 15px;">
            <a href="https://wa.me/5492235950860" title="WhatsApp" target="_blank" rel="noopener noreferrer">
              <img src="https://res.cloudinary.com/dbctwitmb/image/upload/c_thumb,w_200,g_face/v1757003529/mdQNdcFMi0p_eqlwnk.png" alt="WhatsApp" width="auto" height="50" style="display: block;" />
            </a>
          </td>
          <td align="center" style="padding: 0 15px;">
            <a href="https://www.instagram.com/abuelo_mario777" title="Instagram" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width="40" height="40" style="display: block;" />
            </a>
          </td>
        </tr>
      </table>

      <div style="margin-top: 2rem; font-size: 0.9rem; color: #777; text-align: center;">
        © Abuelo Mario · Productos para barbería con historia
      </div>
    </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);
    return res.status(200).json({ success: true, message: 'Mensaje y auto respuesta enviados con éxito' });
  } catch (error) {
    console.error('Error al enviar el mensaje o la auto respuesta:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar el mensaje o la auto respuesta' });
  }
});

// 🚀 Inicio del servidor
const port = process.env.PORT || 4000 
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});