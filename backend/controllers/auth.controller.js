import User from "../models/user.model.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({ message: "Email already exists." });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
    } catch (error) {
        
    }
}