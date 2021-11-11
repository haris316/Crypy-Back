const express = require('express');
const router = express.Router();
const { signup, signin,profile,getProfile,addToFavs} = require('../controller/user');
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/profile',profile);
router.post('/getProfile',getProfile);
router.post('/addToFavs',addToFavs);


module.exports = router;