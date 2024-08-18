const express = require('express');
const Blog = require('../model/blog.model');
const Comment = require('../model/comment.model');
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

        const comment = await Comment.find({postId: postId}).populate('user', "username email");
        res.status(200).send({
            message: "Post retrieved successfully",
            post: post
        });

    } catch (error) {
        console.error("Error fetching single post: ", error);
        res.status(500).send({message: "Error fetching single post"});
    }
});

// update a blog post
router.patch("/update-post/:id", async (req, res) => {
    try {
        const postId = req.params.id;
        const updatedPost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        }, {new: true});

        if(!updatedPost){
            return res.status(404).send({message: "Post not found"});
        }
        res.status(200).send({
            message: "Post updated successfully",
            post:  updatedPost
        });

    } catch (error) {
        console.error("Error updating post: ", error);
        res.status(500).send({message: "Error updating post"});
    }
});

// delete a blog post
router.delete("/:id", async(req, res) => {
    try{
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId);

        if(!post){
            return res.status(404).send({message: "Post not found"});
        }

        // delete related comments
        await Comment.deleteMany({postId: postId});
        res.status(200).send({
            message: "Post delete successfully",
            post:  post
        });

    } catch (error) {
        console.error("Error delete post: ", error);
        res.status(500).send({message: "Error delete post"});
    }
});

// related posts
router.get("/related/:id", async(req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return res.status(404).send({message: "Post id is required"});
        }

        const blog = await Blog.findById(id);

        if(!blog) {
            return res.status(404).send({message: "Post is not required"});
        }

        const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');

        const relatedQuery = {
            _id: {$ne: id}, //exclude the current blog by id
            title: {$regex: titleRegex} //exclude the current blog by title
        } 

        const relatedPost = await Blog.find(relatedQuery);
        res.status(404).send({message: "Related post found!", post: relatedPost});
        
    } catch (error) {
        console.error("Error fetching related post: ", error);
        res.status(500).send({message: "Error fetching related post"});
    }
});

module.exports = router;