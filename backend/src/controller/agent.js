import Agent from "../models/Agents.js"


export const getAgents = async (req, res) => {
    try {
        const agent = await Agent.find({userID: req.user.id})
        if(agent){
            return res.status(200).json(agent)
        }
        return res.status(200).json({ok: false, message: "no agent found"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ok: false, message: "internal server error"})
    }
}
export const addAgent = async (req, res) => {
    const {street, city, state, zip, country, mobile} = req.body;

    console.log(req.body)

    if(!street && !city && !state && !zip && !country && !mobile){
        return res.status(400).json({ok: false, message: "all fields are required"})
    }
    const payload = { userID: req.user.id, address: req.body}

    try {
        const agent = await Agent.create(payload)
        return res.status(200).json({ok: true, agent})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ok: false, message: "internal server error"})
    }
}
