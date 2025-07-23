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
        return res.status(201).json({ message: "User created successfully", user:{
            name,
            email
        } });

    } 
    catch (error) {
        console.log("Internal server error in signup. Error: ", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}