const express = require('express');
const Comment = require('../model/comment.model');
const router = express.Router();

// create a comment
router.post("/post-comment", async (req, res) => {
    // console.log(req.body);
    try {
        const newComment = await Comment(req.body);
        await newComment.save();
        res.status(200).send({message: "Comment created successfully", comment: newComment});
    } catch (error) {
        console.error("An error occurred while posting new comment", error);
        res.status(500).send({message: "An error occurred while posting new comment"});
    }
});

// get all comment count
router.get("/total-comments", async (req, res) => {
    try {
        const totalComment = await Comment.countDocuments({});
        res.status(200).send({message: "Total comment count", totalComment});
    } catch (error) {
        console.error("An error occurred while geting comment count", error);
        res.status(500).send({message: "An error occurred while geting comment count"});
    }
});

module.exports = router;