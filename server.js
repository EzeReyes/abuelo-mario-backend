import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
dotenv.config();
import typeDefs  from './db/schema.js';
import resolvers from './db/resolver.js';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import conectarDB from './config/db.js';
import { expressMiddleware } from '@as-integrations/express5';
import { Resend } from 'resend';

conectarDB();



const resend = new Resend(process.env.RESEND);

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

  // Iniciar el servidor Apollo
await server.start();

// Middlewares globales
const allowedOrigins = [
  'http://localhost:4000',
  'http://localhost:5173',
  'https://abuelomario.com.ar',
  'https://abuelo-mario-backend.onrender.com',
  'https://abuelo-mario-backend.onrender.com/api/contact',
  'https://abuelo-mario-backend.onrender.com/graphql'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado para origen: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
  app.use(express.json()); // 👈 en lugar de express.json()


app.use(
  '/graphql',
  expressMiddleware(server)
);

// 📩 Ruta para recibir y enviar el formulario
app.post('/api/contact', async (req, res) => {
  console.log("holaaa")
  const { nombre, email, mensaje, telefono } = req.body;

const {data, error} = await resend.emails.send({
  from: "contacto@abuelomario.com.ar",
  to: "contacto.abuelo.mario@gmail.com",
  subject: 'Nuevo mensaje desde el formulario de contacto',
  html: `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; color: #333; padding: 2rem; max-width: 600px; margin: auto; border-radius: 12px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #b48b5f; font-size: 2rem; margin-bottom: 1rem;">Nuevo mensaje de contacto</h1>
    <p style="font-size: 1.1rem; line-height: 1.6;">Has recibido un nuevo mensaje desde el formulario de contacto:</p>
    <ul style="list-style: none; padding: 0; font-size: 1.1rem; line-height: 1.6;">
      <li><strong>Nombre:</strong> ${nombre}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</li>
      <li><strong>Mensaje:</strong> ${mensaje}</li>
    </ul>
    <div style="margin-top: 2rem; font-size: 0.9rem; color: #777; text-align: center;">
      © Abuelo Mario · Productos para barbería con historia
    </div>
  </div>
  `
});

  await resend.emails.send({
  from: "contacto@abuelomario.com.ar",
  to: email, // solo este funciona en sandbox
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
});

if (error) {
    console.log('Error al enviar el mensaje:', error);
    return res.status(500).json({ success: false, message: 'Error al enviar el mensaje' });
  }

  console.log('Mensaje enviado:', data);
  return res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
});

  

  


const port = process.env.PORT || 4000;
httpServer.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}/graphql`);
});
