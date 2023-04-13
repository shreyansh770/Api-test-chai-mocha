const mongoose = require('mongoose')
require('dotenv/config')


mongoose.connect(process.env.DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => {
    console.log("user model connected");
}).catch((err) => {
    console.log(err);
})


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'socialUserModel'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'socialUserModel'
    }]
});


const socialUserModel = mongoose.model('socialUserModel', userSchema)

module.exports = socialUserModel