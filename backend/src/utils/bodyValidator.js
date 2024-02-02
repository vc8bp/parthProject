export const isValidBody = (req,res,requiredParams) => {
    console.log("before validating")
    const {body} = req;

    requiredParams.forEach(e => {
        if(body[e] === undefined || body[e] === "") {
            res.status(400).json({success: false, message: `Please provide an ${e} field!!`})
            return false
        }
    });
    return true
}