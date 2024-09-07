const express = require('express');

const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');

const router = express.Router();

// System register a new user
router.post('/register', async(req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({email, password, username});
        // console.log(user);
        await user.save();
        res.status(200).send({message: "User registered successfully", user: user});

    } catch (error) {
        console.error("Failed to register", error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// System login a user
router.post('/login', async(req, res) => {
    try {
        //console.log(req.body);
        const {email, password} = req.body;

        const user = await User.findOne({email});

        // ถ้าไม่เจอ user = email
        if(!user) {
            return res.status(404).send({message: 'User not found1'});
        }

        const isMath = await user.comparePassword(password);

        if(!isMath) {
            return res.status(404).send({message: 'Invalid password!'});
        }

        // generate token here
        const token = await generateToken(user._id);
        // console.log("Generated Token :", token);
        res.cookie("token", token, {
            httpOnl: true, // enable this only when you have https://
            secure: true,
            sameSite: true
        });

        res.status(200).send({message: 'Login successful!', token, user: {
            _id: user.id,
            email: user.email,
            password: user.password,
            role: user.role
        }});


    } catch (error) {
        console.error("Failed to login", error);
        res.status(500).json({ message: 'Login failed! Try again' });
    }
});

// System Logout a user
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie("token", { path: "/"});
        res.status(200).send({ message: "Logout successful!" });
    } catch (error) {
        console.error("Failed to logout", error);
        res.status(500).json({ message: "Logout failed!" });
    }
});

// System get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role');
        res.status(200).send({message: "Users found successfully", users});

    } catch (error) {
        console.error("Error fetching users", error);
        res.status(500).json({ message: "Failed to fetch users!" });
    }
});

// System delete a users
router.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);

        if(!user) {
            return res.status(404).send({message: 'User not found!'});
        }

        res.status(200).send({message: "User deleted successfully"});

    } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).json({ message: "Error deleting user!" });
    }
});

// System Update a user role
router.put('/users/:id', async (req, res) =>{
    try {

        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id, {role}, {new: true});

        if(!user) {
            return res.status(404).send({ message: 'User not found'});
        }

        res.status(200).send({message: "User role updated successfully", user});

    } catch (error) {
        console.error("Error updating user role", error);
        res.status(500).json({ message: "Failed updating user role!" });
    }
});


module.exports = router;