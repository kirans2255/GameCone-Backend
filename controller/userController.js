const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config();
const springedge = require('springedge')

const Signup = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);


    try {
        const existuser = await User.findOne({ email });

        if (existuser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedpassword = await bcrypt.hash(password, 10);

        //user create

        const newUser = new User({
            name,
            email,
            password: hashedpassword,
        })

        await newUser.save();

        console.log("new :", newUser);


        const token = jwt.sign(
            {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
        )

        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 })

        return res.status(201).json({ message: "Signup successful", token })
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

const successGoogleLogin = async (req, res) => {

    try {
        console.log(req.user);
        if (!req.user) {
            return res.status(401).send("No user data, login failed");
        }

        // Check if the user object has the displayName and email properties
        const userName = req.user.displayName || req.user.name;
        const userEmail = req.user.email;

        if (!userEmail) {
            return res.status(401).send("No email found in user data");
        }

        // Checking if user already exists in the database
        let user = await User.findOne({ email: userEmail });

        if (!user) {
            user = new User({
                name: userName,
                email: userEmail,
            });

            await user.save();
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_KEY,
            {
                expiresIn: "24h",
            }
        );

        // Set JWT token in a cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
        });

        // Redirect the user to the home page
        res.status(200).redirect("/");

        console.log("User logged in with Google: JWT created");
    } catch (error) {
        console.error("Error logging in with Google:", error);
        res.status(500).redirect("/");
    }
};

const failureGooglelogin = (req, res) => {
    res.status(500).send("Error logging in with Google");
};


const Login = async (req, res) => {

    const { email, password } = req.body;
    // console.log(req.body)

    try {
        const user = await User.findOne({ email });
        console.log("User:", user);

        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        if(user.isBlocked) {
            return res.status(400).json({ error :"User is Blocked"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_KEY,
            { expiresIn: "24h" }
        );

        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}


const otpLogin = async (req, res) => {
    const { phone } = req.body;
    console.log(phone);
  
    // const Excict = await User.findOne({ phone });
    // if (!Excict) {
    //   return res.status(400).json({ message: "Invalid Phone No" });
    // }
  
    // Function to generate OTP
    const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000); 
    };
  
    // Ensure phone number is correctly formatted with country code
    const formattedPhone = `+91${phone}`; 
    const otp = generateOtp();
    console.log("Generated OTP is:", otp);
  
    const message = `Hello ${otp}, This is a test message from spring edge`;
    const params = {
      sender: "SEDEMO",
      apikey: process.env.API_KEY ,
      to: [formattedPhone],
      message: message,
      format: "json",
    };
  
    // Set OTP in cookie
    res.cookie("otp", otp, {
      httpOnly: true, // Prevent JavaScript from accessing the cookie
      secure: false, // Set to true in production for HTTPS
      sameSite: "Lax",
      maxAge: 5 * 60 * 1000, // Or 'Strict' for more security
    });
  
    // Send OTP via SpringEdge
    springedge.messages.send(params, 5000, function (err, response) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to send message" });
      }
      console.log("Response:", response);
      return res.status(200).json({ success: true, message: "Message sent" });
    });
  };
  
  const verifyOtp = (req, res) => {
    const { otp } = req.body;
    console.log("Body OTP:", otp);
    const cookieOtp = req.cookies.otp;
  
    console.log("Cookie OTP:", cookieOtp);
    if (cookieOtp === otp) {
      res.status(200).json({ success: true, message: "OTP verified" });
    } else {
      res.status(400).json({ error: "Invalid OTP" });
    }
  };


  



module.exports = {
    Signup,
    successGoogleLogin,
    failureGooglelogin,
    Login,
    verifyOtp,
    otpLogin
}