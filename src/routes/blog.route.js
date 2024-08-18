const express = require('express');
const Blog = require('../model/blog.model');
const router = express.Router();


// create a blog post
router.post('/create-post', async(req, res) => {
    try {
        // console.log("Blog data from api: ",req.body)
        const newPost = new Blog({...req.body});
        await newPost.save();
        res.status(200).send({
            message: "Post created successfully",
            post: newPost
        });
    } catch (error) {
        console.error("Error creating post: ", error);
        res.status(500).send({message: "Error creating post"});
    }
});

// get all blogs
router.get('/', async(req, res) => {
    try {
        // fillter start
        const {search, category, location} = req.query;
        console.log(search);

        let query = {};

        if(search) {
            query = {
                ...query,
                $or : [
                    {title: {$regex: search, $options: "i"},},
                    {content: {$regex: search, $options: "i"},}
                ]
            }
        }

        if(category) {
            query = {
                ...query,
                category
            }
        }

        if(location) {
            query = {
                ...query,
                location
            }
        }

        // fillter end

        const post = await Blog.find(query).sort({category: -1}); //fillter แสดง

        res.status(200).send({
            message: "All posts retrieved successfully",
            post: post
        })
    } catch (error) {
        console.error("Error creating post: ", error);
        res.status(500).send({message: "Error creating post"});
    }
});

// get single blog by id
router.get("/:id", async(req, res) => {
    try {
        // console.log(req.params.id)
        const postId = req.params.id;
        const post = await Blog.findById(postId);
        if(!post) {
            return res.status(404).send({message: "Post not found"});
        }

        // Todo: with also fetch comment related to the post
        res.status(200).send({
            message: "Post retrieved successfully",
            post: post
        });

    } catch (error) {
        console.error("Error fetching single post: ", error);
        res.status(500).send({message: "Error fetching single post"});
    }
});


module.exports = router;