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
        obtenerProductos: async () => {
            try {
            const productos = await Product.find({}).lean();
            return productos;
            } catch(error) {
                console.log(error);
            }
        },
        obtenerProducto: async (_, {id}) => {
            try {
            const producto = await Product.findById(id).lean();
            return producto;
            } catch(error) {
                console.log(error);
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