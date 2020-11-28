const ErrorResponse = require("../utils/errorResponse")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("../middleware/async");
const User = require("../models/User")

const login = asyncHandler(async(req,res,next) => {
    const { email, password } = req.body;
        // Check user credentials
        let user = await User.findOne({ email }).select('+password')

        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 400))
        }

        console.log(user)
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return next(new ErrorResponse("Invalid credentials", 400))
        }

        // Return  jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };
        jwt.sign(
            payload,
           process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) next(err);
                res.json({ token });
            }
        )
})

module.exports = login;