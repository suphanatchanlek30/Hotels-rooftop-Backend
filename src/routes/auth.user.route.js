const express = require('express');
const User = require('../model/user.model');

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

        // todo : generate token here
        res.status(200).send({message: 'Login successful!', user: {
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


module.exports = router;