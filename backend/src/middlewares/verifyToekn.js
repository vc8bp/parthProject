import jwt from "jsonwebtoken"
import env from "dotenv"
env.config()

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {  
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_TOKEN_SECRATE, (err, user)=> {
          if(err){
            res.status(401).json({message: "token is not valid"});
          }else {
            console.log(user)
             req.user = user;
            next();
          }
        })
    } else {
      res.status(401).json({message: "You are not Loged in"});
    }
  }

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
      if(req.user.isAdmin) next()
      else res.status(403).json({message: "you are not allowed to do that "}) 
    })   
}
