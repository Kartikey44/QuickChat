import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            default:"",
            trim: true,
        },
        img: {
            type: String,
            default:null
        },
        seen: {
            type: Boolean,
            default: false,
        },
        readAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message',messageSchema)
export default Message