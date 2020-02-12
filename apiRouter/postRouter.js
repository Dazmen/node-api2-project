const express = require('express');
const router = express.Router();
const Posts = require('../data/db.js');

router.post('/', (req, res) => {
    const body = req.body;
    if(body.title && body.contents){
        Posts.insert(body)
            .then(post => {
                res.status(201).json(post)
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({
                  message: "There was an error while saving the post to the database"
                });
              })
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
});
router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const comment = req.body;
    comment.post_id = id
    Posts.findById(id)
        .then(post => {
            if(post){
                if(comment.text){
                    Posts.insertComment(comment)
                        .then(newComment => {
                            res.status(201).json(newComment)
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).json({
                              message: "There was an error while saving the comment to the database"})
                        })
                } else {
                    res.status(400).json({ errorMessage: "Please provide text for the comment." })
                }
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
              message: "There was an error (from the first .catch) while saving the comment to the database"})
        })
});
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: "The posts information could not be retrieved."
            });
          })
});
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
        .then(post => {
            if(post){
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: "The post information could not be retrieved."
            });
          })
});
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    Posts.findPostComments(id)
        .then(comments => {
            if(comments){
                res.status(200).json(comments);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: "The comments information could not be retrieved."
            });
          })
});
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Posts.remove(id)
        .then(post => {
            if(post){
                res.status(200).json({ message: "post has been deleted" })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: "The post could not be removed."
            });
          })
});
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body;
    // const postToEdit = Posts.findById(id);

    // if (postToEdit) {
    //     res.status(404).json({ message: "The post with the specified ID does not exist." })
    // } else if (body.title && body.contents) { 
    //     Posts.update(id, body)
    //     .then(post => {
    //         res.status(200).json(post)
    //     })
        // .catch(error => {
        //     console.log(error);
        //     res.status(500).json({
        //         error: "The post information could not be modified."
        //     });
        //   })
    // } else {
    //     res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    // }
    Posts.update(id, body)
        .then(post => {
            if(post){
                if(body.title && body.contents){
                    res.status(200).json(body)
                } else {
                    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
                }
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: "The post information could not be modified."
            });
          })
});

module.exports = router
