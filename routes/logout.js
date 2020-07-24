const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/logout",
 // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ loggedOut: true });
  }
);
router.get(
  "/authenticated",
 // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("Called");
    const { username } = req.user;
    res.status(200).json({ isAuthenticated: true, userData: { username } });
  }
);

module.exports = router;
