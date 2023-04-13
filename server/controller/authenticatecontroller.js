const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv/config')
const JWT_KEY = process.env.JWT_KEY;

const socialUserModel = require('../model/socialUserModel')


exports.authenticate = async (req, res) => {

    try {

        let {
            email,
            password
        } = req.body;

        let user = await socialUserModel.findOne({
            email: email
        })

        if (user) {

            if (password == user.password) {

                let payload = user.email

                const token = jwt.sign({
                    id: payload
                }, JWT_KEY)

                res.cookie('login', token, {
                    httpOnly: true
                })

                res.status(200).json({
                    token: token
                })

            } else {
                res.json({
                    message: "Incorrect email or password",
                })
            }

        } else {

            res.json({
                message: "No such user exits"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.signIn = async (req, res) => {
    try {

        let user = await socialUserModel.create(req.body)

        res.json({
            message: "user created"
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}