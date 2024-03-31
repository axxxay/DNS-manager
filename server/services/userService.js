const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const initializeDB = require('../config/database');
require('dotenv').config();


let db;
initializeDB().then(database => {
  db = database;
});


const getUser = async (email) => {
    try {
        const user = await db.get('SELECT * FROM user WHERE email LIKE LOWER(?)', [email]);
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const createUser = async (user) => {
    try {
        const { username, email, password } = user;
        console.log(db)

        // Username validation
        if (username.length < 6) {
            const error = new Error('Username should be at least 6 characters');
            error.statusCode = 400;
            throw error;
        }

        // Email validation
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            const error = new Error('Invalid email');
            error.statusCode = 400;
            throw error;
        }

        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            const error = new Error('Password should be at least 8 characters and contain at least one uppercase, one lowercase, one digit and one special character');
            error.statusCode = 400;
            throw error;
        }

        // Check if user already exists
        const existingUser = await getUser(email);
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.run(
            'INSERT INTO user (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        return {message: 'User created successfully'};
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const loginUser = async (user) => {
    try {
        const { email, password } = user;
        const existingUser = await getUser(email);
        if (!existingUser) {
            const error = new Error('User does not exist');
            error.statusCode = 404;
            throw error;
        }
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }
        const jwtToken = jwt.sign({email: existingUser.email}, process.env.JWT_SECRET);
        return {jwtToken};
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getAllUsers = async () => {
    try {
        const users = await db.all('SELECT * FROM user');
        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    createUser,
    loginUser,
    getAllUsers
}