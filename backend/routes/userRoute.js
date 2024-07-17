const express = require("express");
const router = express.Router();

const {Signin ,Signup,refreshToken,getMessage}  = require("../controller/userController")

const userAuth = require("../middleware/userAuth")

router.post("/signin",Signin);
router.post("/signup",Signup);
router.post('/refresh', refreshToken);
router.get('/message',userAuth, getMessage);


module.exports = router;