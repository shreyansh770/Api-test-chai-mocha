const mongoose = require('mongoose')
require('dotenv/config')


mongoose.connect(process.env.DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => {
    console.log("post model connected");
}).catch((err) => {
    console.log(err);
})


const postSchema = new mongoose.Schema({


    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'socialUserModel',
        required: true
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        require: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'socialUserModel',
        }]
    },

    comments: [{
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            auto: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }]

})

const postModel = mongoose.model('postModel', postSchema)

module.exports = postModel;