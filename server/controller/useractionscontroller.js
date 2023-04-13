const express = require('express');
const socialUserModel = require('../model/socialUserModel');

exports.getUser = async (req, res) => {
    try {

        let {
            aId
        } = req;

        const user = await socialUserModel.findOne({
            email: aId
        }).select('-password')

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        let userObj = {
            UserName : user.name,
            Followers:user.followers.length,
            Following: user.following.length
        }
        return res.json({
            userObj
        });



    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

exports.followUser = async (req, res) => {
    try {

        let {
            aId
        } = req // follower email
        const {
            id
        } = req.params; //following

        const user = await socialUserModel.findOne({
            email: aId
        })

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }


        const followUser = await socialUserModel.findById(id);
        if (!followUser) {
            return res.status(404).json({
                message: 'User to follow not found'
            });
        }


        if (user.following.includes(followUser._id)) {
            return res.status(400).json({
                message: 'User is already following this user'
            });
        }

        user.following.push(followUser._id);
        await user.save();


        followUser.followers.push(user._id);
        await followUser.save();

        return res.json({
            message: 'User followed successfully'
        });


    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

exports.unfollowUser = async (req, res) => {
    try {

        let {
            aId
        } = req // follower email
        const {
            id
        } = req.params; //following

        const user = await socialUserModel.findOne({
            email: aId
        })

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }


        const unfollowUser = await socialUserModel.findById(id);
        if (!unfollowUser) {
            return res.status(404).json({
                message: 'User to follow not found'
            });
        }


        // Check if user is already following
        if (!user.following.includes(unfollowUser._id)) {
            return res.status(400).json({
                message: 'User is not following this user'
            });
        }

        // Remove user from following list
        user.following = user.following.filter(followId => followId.toString() !== unfollowUser._id.toString());
        await user.save();

        // Remove follower from followers list
        unfollowUser.followers = unfollowUser.followers.filter(followerId => followerId.toString() !== user._id.toString());
        await unfollowUser.save();

        return res.json({
            message: 'User unfollowed successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error'
        });
    }
}