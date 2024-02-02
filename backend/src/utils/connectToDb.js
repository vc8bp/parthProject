import mongoose from "mongoose"

const connectTodb= (url) => {

    mongoose.connect(url).then(() => {
        console.log("Connected to db successfully!!")
    }).catch(e => {
        console.log(e)
        console.log("Failed to connect to db")
    })
}

export default connectTodb