const jwt = require('jsonwebtoken');
const {jwtkey} = require('../config/keys')
const user = require('../models/user')

module.exports = (req,res,next)=>{
       const { authorization } = req.headers;
       //authorization === Bearer sfafsafa
       if(!authorization){
           return res.status(401).send({error:"you must be logged in"})
       }
       const token = authorization.replace("Bearer ","");
       jwt.verify(token,jwtkey,async (err,payload)=>{
           if(err){
             return  res.status(401).send({error:"you must be logged in 2"})
           }
           try{
                const {userId} = payload;
                const id = userId
                const use = await user.findOne({ where: {id} })
                req.us=use;
                next();
           }
           catch(err){
            return res.send(err)
        }
       })
}