import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;