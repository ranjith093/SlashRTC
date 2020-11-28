const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// @route   POST api/users
// @desc    Register user
// @access  Public
const register = asyncHandler(async (req,res) => {
        const { name, email, password } = req.body;
            // See if the user exists
            let user = await User.findOne({email});

            if (user) {
                return next(new ErrorResponse("User already exists", 400))           
            }
            user = new User({
                name,
                email,
                password,
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            // Return  jsonwebtoken
            const payload = {
                user: {
                    id: user._id,
                },
            };
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
});

module.exports = register