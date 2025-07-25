import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            console.log("Error due to missing fields in signup. name: ", name, " email: ", email);
            console.log("Fill all fields.");
            return res.status(400).json({ message: "All fields are required." });
        }
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            console.log("Error due to existing email in signup. email: ", email);
            console.log("Enter a different email.");
            return res.status(400).json({ message: "Email already exists." });
        }
        if(password.length < 6) {
            console.log("Invalid password.");
            console.log("Password must be at least 6 characters.");
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        console.log("User created successfully.");
        console.log({ name, email });

        const token = await genToken(user._id);
        if (!token) {
            console.log("Error generating token for user ID: ", user._id);
            return res.status(500).json({ message: "Error generating token." });
        }
        else {
            console.log("Token generated successfully for user ID: ", user._id);
        }

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        });

        if (!res.cookie) {
            console.log("Error setting cookie with token.");
            return res.status(500).json({ message: "Error setting cookie." });
        }
        else {
            console.log("Cookie set successfully with token.");
        }

        console.log("User signup successful. User details: ", { name, email });
        return res.status(201).json({ message: "Succesfully signed up", user:{
            name,
            email
        } });

    } 
    catch (error) {
        console.log("Internal server error in signup. Error: ", error.message);
        return res.status(500).json({ message: "Sign Up error", error: error.message });
    }
}


export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("Error due to missing fields in login. email: ", email);
            console.log("Fill all fields.");
            return res.status(400).json({ message: "All fields are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User does not exist.");
            return res.status(400).json({ message: "User does not exist." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password.");
            return res.status(400).json({ message: "Invalid password." });
        }

        const token = await genToken(user._id);
        if (!token) {
            console.log("Error generating token for user ID: ", user._id);
        }
        else {
            console.log("Token generated successfully for user ID: ", user._id);
        }

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        });

        console.log("Cookie set successfully with token.");
        
        console.log("User logged in successfully. User details: ", { email });


        return res.status(200).json({ message: "Successfully logged in", user:{
            name: user.name,
            email
        } });

    } 
    catch (error) {
        console.log("Internal server error in login. Error: ", error.message);
        return res.status(500).json({ message: "Login error", error: error.message });
    }
}

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        console.log("User logged out successfully.");
        return res.status(200).json({ message: "Successfully logged out" });
    } 
    catch (error) {
        console.log("Internal server error in logout. Error: ", error.message);
        return res.status(500).json({ message: "Logout error", error: error.message });
    }
}