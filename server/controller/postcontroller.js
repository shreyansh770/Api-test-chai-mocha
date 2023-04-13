const express = require('express');
const postModel = require('../model/postModel');
const socialUserModel = require('../model/socialUserModel');

exports.addpost = async (req, res) => {
    try {

        let {
            aId
        } = req

        let {
            title,
            description
        } = req.body

        let user = await socialUserModel.findOne({
            email: aId
        })


        let postObj = {
            uid: user._id,
            title,
            description,
        }

        let post = await postModel.create(postObj)

        res.json({
            message: "Post created"
        })


    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

exports.deletePost = async (req, res) => {
    try {

        let {
            id
        } = req.params

        // Find the post to be deleted
        await postModel.findByIdAndDelete(id);

        // Remove the post ID from the liked array of all users who have liked it
        const users = await socialUserModel.find({});
        for (const user of users) {
            const index = user.likedPosts.indexOf(id);
            if (index > -1) {
                user.likedPosts.splice(index, 1);
                await user.save();
            }
        }

        res.status(200).json({
            message: 'Post deleted successfully'
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.likePost = async (req, res) => {
    try {

        let {
            aId
        } = req

        let {
            id
        } = req.params

        let user = await socialUserModel.findOne({
            email: aId
        })

        let uid = user._id

        const post = await postModel.findById(id);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        // Check if user has already liked the post
        if (post.likes.includes(uid)) {
            return res.status(400).json({
                message: 'You have already liked this post'
            });
        }

        // Add the post ID to the user's likedPosts array
        const updateuser = await socialUserModel.findByIdAndUpdate(
            uid, {
                $addToSet: {
                    likedPosts: id
                }
            }, // Use $addToSet to avoid duplicate entries
            {
                new: true
            }
        );

        // Add the user ID to the post's likes array
        post.likes.push(uid);
        await post.save();

        res.status(200).json({
            message: 'Post liked successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

exports.unlikePost = async (req, res) => {
    try {
        let {
            id
        } = req.params
        let {
            aId
        } = req

        let user = await socialUserModel.findOne({
            email: aId
        })
        let uid = user._id

        const post = await postModel.findByIdAndUpdate(
            id, {
                $pull: {
                    likes: uid
                }
            }, {
                new: true
            }
        );

        // Remove the post ID from the liked array of the user
        const updatedUser = await socialUserModel.findByIdAndUpdate(
            uid, {
                $pull: {
                    likedPosts: id
                }
            }, {
                new: true
            }
        );

        res.status(200).json({
            message: "Post unliked"
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

exports.commentPost = async (req, res) => {
    try {

        let {
            comment
        } = req.body
        let {
            id
        } = req.params

        let  {aId} = req

        let user = await socialUserModel.findOne({email : aId})

        let userId = user._id

        const post = await postModel.findById(id);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        const newComment = {
            userId,
            comment
        };

        post.comments.push(newComment);
        await post.save();

        const commentId = post.comments[post.comments.length - 1]._id;

        return res.status(201).json({
            commentId
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

exports.getPost = async (req,res)=>{
    try {

        let {id} = req.params

        let post = await postModel.findById(id)

        let user = await socialUserModel.findById(post.uid)

        let postObj = {
            createdBy : user.name,
            title : post.title,
            description : post.description,
            likes : post.likes.length,
            comments : post.comments.length
        }

        return res.json(postObj)

        
    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

exports.getAllPost = async (req, res) => {
    try {

        let {
            aId
        } = req

        let user = await socialUserModel.findOne({
            email: aId
        })

        let id = user._id
        const posts = await postModel.find({
            uid: id
        }).sort({
            createdAt: -1
        });
        const postObject = posts.map((post) => {
            return {
                id: post._id,
                title: post.title,
                desc: post.description,
                created_at: {
                    date: post.createdAt.toLocaleDateString(),
                    time: post.createdAt.toLocaleTimeString()
                },
                comments: post.comments,
                likes: post.likes.length
            };
        });
        res.status(200).json(postObject);

    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
}