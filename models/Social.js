const { Schema } = require("mongoose")

const mongoose = requiire("mongoose")

const SocialSchema = new mongoose.Schema({
    googleProfile:{
        id: String,
        email: String,
        name: String
      },
      githubProfile: {
        id: String,
        email:String,
        username: String
      },
      user: {
          type: Schema.Types.ObjectId
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
})

module.exports = mongoose.model("Social", SocialSchema)