const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const db = require('../models');
const { encrypt } = require('../utils/encryption');

/**
 * Handles user login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */
router.post('/login', function (req, res, next) {
    const { username, password } = req.body;

    // Find user in the database by username
    return db.User.findOne({ where: { username: username } })
        .then((user) => {
            if (!user) {
                // If user not found, send a 401 Unauthorized response
                return res.status(401).send('Invalid username or password');
            }

            // Compare hashed password using bcrypt
            bcrypt.compare(password, user.password, (err, result) => {
                if (err || !result) {
                    // If password doesn't match, send a 401 Unauthorized response
                    return res.status(401).send('Invalid username or password');
                }

                // If login is successful, generate an access token
                const { dataValues: userData } = user;
                const strigifedUser = JSON.stringify(userData);
                const accessToken = encrypt(strigifedUser);

                // Prepare response object
                const response = {
                    user,
                    accessToken,
                };

                // Send a 201 Created response with the response object
                res.status(201).json(response);
            });
        })
        .catch((err) => {
            // Handle errors and send a 400 Bad Request response
            console.log('*** error during login', JSON.stringify(err));
            return res.status(400).send(err);
        });
});

module.exports = router;
