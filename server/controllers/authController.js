
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";


//REGISTRATION
export const register=async (req, res) =>{
    const{name, email, password}=req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: 'Missing Details'})

    }
    try{
        const exisitingUser= await userModel.findOne({email})

        if(exisitingUser){
            return res.json({success: false, message: 'User already exists'});
        }
        const hashedPassword=await bcrypt.hash(password, 10);

        const user=new userModel({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production', //false
            sameSite:process.env.NODE_ENV==='production' ?'none': 'strict',
            maxAge: 7*24*60*60*1000

        });


        //sending welcome email
        const mailOptions= {
            from: process.env.SENDER_MAIL,
            to: email,
            subject: 'Welcome to my first MER project',
            text: `Your account has been created by: ${email}`,
        }

        await transporter.sendMail(mailOptions);
        return res.json({success: true});
    }
    catch(error){
        res.json({success: false, message:error.message})
    }
}


//LOGIN
export const login=async(req, res) =>{
    const {email, password}=req.body;
    if(!email || !password){
        return res.json({success: false, message:"Email and password are required"});
    }
    try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message:"Invaild Email"});
        }
        
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message:"Invaild Password"});
        }
        
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

        res.cookie('token', token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production', //false
            sameSite:process.env.NODE_ENV==='production' ?'none': 'strict',
            maxAge: 7*24*60*60*1000
        });
        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
        
    }catch(err){
        return res.json({success: false, message: err.message})
    }
}

//LOGOUT
export const logout=async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production', //false
            sameSite:process.env.NODE_ENV==='production' ?'none': 'strict',
        })

        return res.json({success:true, message:"Logged Out"});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}


//SEND VERIFICATION OTP TO THE USER'S EMAIL
export const sendVerifyOtp=async(req, res)=> {
    try{
        const{id}= req.user;
        const user=await userModel.findById(id);

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"})
        }

        const otp= String(Math.floor(10000+Math.random()*90000));
        
        user.verifyOtp=otp;
        user.verifyOtpExpireAt=Date.now()+24*60*60*1000;

        await user.save();

        const mailOptions={
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.` , html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message:"Verification OTP sent on Email"}); 


    }catch(err){
        return res.json({success: false, message: err.message});
    }
}



//VERIFY EMAIL
export const verifyEmail=async(req, res)=> {
     const{otp}= req.body;
     const { id }=req.user;

     if( !otp) {
        return res.json({success: false, message: "Missing OTP"});
     }

     try{
        const user=await userModel.findById(id);

        if(!user){
            return res.json({success: false, message: "User not found"});

        }

        if(user.verifyOtp==='' || user.verifyOtp!==otp){
            return res.json({success: false, message: "Invaild OTP"});

        }

        if(user.verifyOtpExpireAt<Date.now()){
            return res.json({success: false, message:"OTP expired"});
        }

        //resetting otp
        user.isAccountVerified=true;
        user.verifyOtp="";
        user.verifyOtpExpireAt=0;
        await user.save();
        return res.json({success: true, message:"Email verified successfully"});

     }catch(err){
        return res.json({success: false, message: err.message});
     }

}

//Check if Account is authenticated or not
export const isAuthenticated =async(req, res) =>{
    try{
        return res.json({success: true});
    }

    catch(err){
        return res.json({success: false, message: err.message});
    }

}


//Send password reset otp
export const sendResetOtp = async(req, res)=>{
    const {email}=req.body;

    if(!email){
        return res.json({success: false, message: "Email is required"});
    }

    try{

        const user= await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        const otp= String(Math.floor(100000+Math.random()*900000));
        
        user.resetOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*1000;

        await user.save();

        const mailOptions={
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed  with resetting your password.`,
            html : PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({success: true, message:"OTP sent to your Email"}); 
    }
    catch(err){
        return res.json({success: false, message: err.message});
    }

}


//Verify the OTP and reset user password
export const resetPassword= async(req, res)=> {
    const {email, otp, newPassword} =req.body;

    if(!email || !otp || !newPassword){
         return res.json({success: false, message: 'Email, OTP and new password are required'});
    }

    try{
        
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        if(user.resetOtp==='' || user.resetOtp!==otp){
            return res.json({success: false, message: "OTP is invaild"});
        }

        if(user.resetOtpExpireAt < Date.now()){
             return res.json({success: false, message: "OTP expired"});
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        user.password= hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt=0;
        await user.save();

        return res.json({success: true, message: "Password saved successfully"});
    }
    catch(err){
        return res.json({success: false, message: err.message});
    }
}
