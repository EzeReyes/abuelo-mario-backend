import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['CERA', 'POMADA', 'AFTERSHAVE', 'ACEITE BARBA', 'TEXTURIZADOR'],
        required: true
    },    
    fijacion: {
        type: String
    },
    aroma: {
        type: String
    },
    efecto: {
        type: String
    },
    imagen: {
        type: String
    }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;