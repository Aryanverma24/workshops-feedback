import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import twilio from 'twilio';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';
//router 
import router from './certificate.js';

config();

const app = express();

console.log(process.env.FRONTENDURL)
app.use(cors({
  origin: [
            "https://aryan-workshop-feedback-system.netlify.app",
            process.env.FRONTENDURL,
  ],
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5002;

app.use('/', router);

const AccountSID = process.env.Account_SID;
const AUTHTOKEN = process.env.AUTH_TOKEN;
const Twillo_PHONE = process.env.TWILLO_PHONE

const client = twilio(AccountSID,AUTHTOKEN);

let otpStore = {};
app.post('/api/send-otp', async (req,res)=>{
    console.log('inside')
    const {phone} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    try{
        const something = await client.messages.create({
            body : `Your OTP is ${otp}`,
            from : Twillo_PHONE,
            to : phone
        })
        console.log(something)
        otpStore[phone] = otp;
        console.log(`OTP sent to ${phone}: ${otp}`);
        setTimeout(() => delete otpStore[phone],5*60*1000);
        res.status(200).json({message : 'OTP sent successfully'});
    }
    catch(err){
        console.error('Error sending otp: ', err);
        res.status(500).json({error : "Failed to send otp"});
    }
})

app.post('/api/verify-otp',(req,res)=>{
    const {phone,otp}=req.body;
    console.log('inside verify otp')
    if(!phone || !otp){
        return res.status(400).json({error: "Phone number and otp are required"});
    }
    if(otpStore[phone] && otpStore[phone] === otp){
        delete otpStore[phone];
        console.log(`otp verified for ${phone}`);
        return res.status(200).json({message: "Otp verified successfully"});
    }else{
        console.log(`otp verification failed for ${phone}`);
        return res.status(400).json({error: "Invalid otp"});
    }
})


// email verification

const emailOtpStore = {};

const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth : {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

app.post('/api/send-email-otp',async (req,res)=>{
    const {email} = req.body;
    const otp = Math.floor(100000 + Math.random()*900000).toString();
    try {
        
        await transport.sendMail({
            from:  `Workshop Team ${process.env.EMAIL}`,
            to : email,
            subject : 'Your OTP for Workshop Feedback System',
            text : `Your OTP is ${otp}. It is valid for 5 minutes.`,
            html: `<p>Your OTP is <strong>${otp}</strong>/.It is valid for 5 minutes.</p>`
        });
        emailOtpStore[email]=otp;
        console.log(`Email OTP sent to ${email} : ${otp}`);
        setTimeout(()=> delete emailOtpStore[email],5*60*1000);
        res.status(200).json({message : "Email OTP sent successfully!"})
    } catch (error) {
        console.log('Error sending email otp : ', error)
        res.status(500).json({error:"Failed to send email otp"});
        return;
    }
})

app.post('/api/verify-email-otp',(req,res)=>{
    const {email,otp}= req.body;
    if(!email || !otp){
        return res.status(400).json({error: "Email and Otp are required"});
    }
    if(emailOtpStore[email] && emailOtpStore[email]===otp){
        delete emailOtpStore[email];
        console.log(`Email Otp is verified for ${email}`);
        return res.status(200).json({message: "Email otp is verified successfully"});
    }
    return res.status(400).json({error: "Invalid email otp"});
})


app.post('/api/send-certificate-to-email', async(req,res)=>{

    const {email,certificateUrl,workshopName,name} = req.body;
    if(!email || !certificateUrl){
        return res.status(500).json({error: "Email and certificate url is required"});
    }
    try {
        
        await transport.sendMail({
            from: `WorkShop Team ${process.env.EMAIL}`,
            to : email,
            subject: `🎓 ${workshopName} Your WorkShop Certificate`,
            text: `Congratulations! You have successfully completed the ${workshopName} workshop. You can download your certificate from the link below: \n ${certificateUrl}`,
           html: `
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thanks for participating in <strong>${workshopName}</strong>.</p>
                <p>Your certificate is ready! Click below to view or download it:</p>
                <p><a href="${certificateUrl}" target="_blank" style="color:green;">🎉 View Certificate</a></p>
                <br />
                <p>Best regards,<br />Workshop Team</p>`,
        })
        res.status(200).json({message: "Certificate sent to email successfully!"});
    } catch (error) {
        console.error(`Error sending certificate to email: ${email}`, error);
        return res.statusCode(500).json({error : "Failed to send certificate to email"});
    }
})


app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`);
})



