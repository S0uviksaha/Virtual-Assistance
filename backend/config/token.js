import jwt from 'jsonwebtoken';

const genToken = async (userId) => {
    try {
        const token = await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '30d'});
        console.log("Token generated successfully for user ID: ", userId);
        return token;
    } catch (error) {
        console.log("Error generating token: ", error.message);
    }
}

export default genToken;