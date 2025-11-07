import Message from "../models/Message.js";
import Product from "../models/Product.js";

const resolvers = {
    Query: {
        obtenerMensajes: async () => {
            try {
            const mensaje = await Message.find({})
             return mensaje;
            } catch(error) {
                console.log(error)
            }
        },
        obtenerProductos: async (_, { page = 1, limit = 10 }) => {
            try {
            const skip = (page - 1) * limit;

            // 🔹 Solo seleccionamos los campos necesarios para la vista general
            const productos = await Product.find({}, 'nombre precio imagen stock')
                .skip(skip)
                .limit(limit)
                .lean();

            // 🔹 Conteo total para paginación
            const total = await Product.countDocuments();

            return {
                productos,
                total,
                paginas: Math.ceil(total / limit),
                paginaActual: page
            };
            } catch (error) {
            console.error("Error al obtener productos:", error);
            throw new Error("Error al obtener productos");
            }
        },
        obtenerProducto: async (_, { id }) => {
            try {
            // 🔹 findById + .lean() (más rápido que devolver documento de Mongoose)
            const producto = await Product.findById(id).lean();
            if (!producto) throw new Error("Producto no encontrado");
            return producto;
            } catch (error) {
            console.error("Error al obtener producto:", error);
            throw new Error("Error al obtener producto");
            }
        }
    },
    Mutation: {
        crearMensaje: async  (_, {input}) => {
            const nuevoMensaje = await new Message(input);
            const result = nuevoMensaje.save();
            return result;
        },
        crearProducto: async (_, {input}) => {
            const nuevoProducto = await new Product(input);
            const result = nuevoProducto.save();
            return result;
        }
    }
}
export default resolvers;