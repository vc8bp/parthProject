import mongoose from "mongoose"

const AgentSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    address: {
        name: {
            type: String,
            required: [true, "Agent name is required!!"]
        },
        street: {
            type: String, 
            required: [true, "street cannot be empty!"]
        },
        city: {
            type: String, 
            required: [true, "City cannot be empty!"]
        },
        state: {
            type: String, 
            required: [true, "State cannot be empty!"]
        },
        zip: {
            type: String, 
            required: [true, "Zip cannot be empty!"]
        },
        mobile: {
            type: Number, 
            required: [true, "Mobile cannot be empty!"]
        }
    }
})

const Agent = mongoose.model("agent", AgentSchema)
export default Agent