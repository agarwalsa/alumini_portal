const userService = require('../services/user-service');
const registerUser = async(req,res)=>{
    try{
        const user = await userService.registerUser(req.body);
        res.status(201).json({
            message: 'user is registered successfully on the platform' , user
        });
    }catch(error){
           
        res.status(400).json({
            error: error.message
        });
    }
};
const loginUser = async(req,res)=>{
    try{
      const user = await userService.loginUser(req.body);
      res.status(200).json({
        message: 'user is successfully logged in',user
      });
    }catch(error){
       res.status(400).json({
        error: error.message
       });
    }
};
module.exports = {
    registerUser,
    
    
    
    loginUser
};