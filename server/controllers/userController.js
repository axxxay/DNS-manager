const userServices = require('../services/userService');

const registerUser = async (req, res) => {
    const user = req.body;
    try {
        const newUser = await userServices.createUser(user);
        res.status(201).json(newUser);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const loginUser = async (req, res) => {
    const user = req.body;
    try {
        const token = await userServices.loginUser(user);
        res.json(token);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

module.exports = {
    registerUser,
    loginUser,
    getAllUsers
}
