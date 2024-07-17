const jwt = require('jsonwebtoken');
const {z} = require("zod")
const bcrypt = require('bcrypt');


const {User} = require("../db/Schema");
const  JWT_SECRET  = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const {saltRounds} = require("../config/config");

const userSignin =z.object({
    email:z.string().email().min(3, { message: "username must be 3 or more characters long" })
    .max(30,{message:"username must be 30 or less characters long"}),
    password:z.string().min(5,{message:"password must be more than 5 length"})
});

const userSignup =z.object({
    email:z.string().email().min(3, { message: "username must be 3 or more characters long" })
    .max(30,{message:"username must be 30 or less characters long"}),
    password:z.string().min(5,{message:"password must be more than 5 length"}),
    firstName:z.string().min(1,{message:"First name should not be empty"}).max(50, { message: "firstName must be 50 or less 50 long" }),
    lastName:z.string().min(1,{message:"Last name should not be empty"}).max(50, { message: "lastName must be 50 or less 50 long" })
});



const Signin = async (req,res)=>{
    // console.log("requested body is",req.body);

    const email =req.body.Email;
    const password =req.body.Password;
    
    try {
        userSignin.parse({email,password});
        const userExist = await User.findOne({email});
       
        if(userExist){
            const result = await bcrypt.compare(password,userExist.password);
            if(result){
        
                    var token = jwt.sign({ email }, JWT_SECRET,{expiresIn:'15m'});
                    const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
                    userExist.refreshToken = refreshToken;
                    await userExist.save();

                    res.status(200).json({
                        message: "successfully login",
                        data:{
                            token,
                            refreshToken
                        }
                        
                    });  
            }else{
                res.status(411).json({
                    message: ["Password is incorrect"]
                });
            }
            

        }else{
            res.status(411).json({
                message: ["User does not exist"]
            });
        }
    } catch (error) {
        console.log("error is ",error.message);
        if(error.name==="ZodError"){
            return res.status(411).json({
                message: error.errors.map(err => err.message),
            });
        }
        return res.status(411).json({
            message: ["Error while sign in"]
        });
    }

}

const Signup = async (req,res)=>{
    // console.log("Signup reqest body data",req.body);
    const email =req.body.Email;
    const password =req.body.Password;
    const firstName =req.body.firstName;
    const lastName =req.body.lastName;

    // console.log("email is",email," Pawword is ",password," first name is ",firstName," last name is ",lastName);
    try {
        userSignup.parse({ email, password, firstName, lastName });
        
        const userExist = await User.findOne({email});
        console.log("user exist",userExist);

        if(userExist){            
            return res.status(411).json({
                message: ["Email already taken"]
            })

        }else{
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await User.create({
                email,
                password:hashedPassword,
                firstName,
                lastName,
            })
            if(user){
                var token = jwt.sign({ email }, JWT_SECRET);
                const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
                user.refreshToken = refreshToken;
                await user.save();

                return res.status(200).json({
                    message: "successfully Signup",
                    data:{
                        token,
                        refreshToken
                    }   
                });
                
            }else{
                return res.status(411).json({
                    message: ["Signed up failed"]
                });
            }
        
        }
    } catch (error) {

        console.log("error is ",error.message);
        if(error.name==="ZodError"){
            return res.status(411).json({
                message: error.errors.map(err => err.message),
            });
        }
        return res.status(411).json({
            message: ["Error while sign up"]
        });
    } 
    
}

const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
    
    try {
      const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
      const userExist = await User.findOne({ email: decoded.email });
      
      if (!userExist || userExist.refreshToken !== token) {
        return res.sendStatus(403);
      }
      
      const accessToken = generateAccessToken(decoded.email);
      res.json({ accessToken });
    } catch (error) {
      console.log(error);
      res.sendStatus(403);
    }
  };



  const getMessage = async(req,res)=>{
    const refreshToken = req.body.refreshToken;
    if (req.token) {
        return res.status(200).json({
          message: "Access granted with new token",
          data: {
            token,
            refreshToken
          }
        });
      }
    return res.status(200).json({
        message:"hello from get message"
    })
  }
module.exports = {Signin,Signup,refreshToken,getMessage};