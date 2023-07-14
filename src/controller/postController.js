const postsCollection = require("../models/postModel");
const sendEmail = require("../utils/sendEmail");

const doCreatePost = async (req, res) => {
    try {
     
        const post = new postsCollection(req.body);
        const result = await post.save()
        const posts = await postsCollection.find();
        await sendEmail("naveed@techloset.com", "new post created", posts.toString())

        res.status(200).json({
            message: 'sucess',
            data: posts
        })
    } catch (error) {
        res.status(500).json({
            message: 'failed',
            error: error,
            data: []
        })
    }

}


const doDeletePost = async(req, res) => {
    try {
    const idValue = parseInt(req.query.id)
    const posts = await postsCollection.deleteOne({postOs:req.query.id})
    res.status(200).json({
      message: 'sucess',
      data: posts
    })
    } catch (error) {
      res.status(500).json({
        message: 'failed',
        error:error,
        data: []
      })
    }
    
  }


  const doGetPosts = async(req, res) => {
    try {
  
      let posts = []
        if (req.query.uid) {
          posts = await postsCollection.find({postOs:  req.query.uid});
        }
        else {
          posts = await postsCollection.find();
        }
     
  
      res.status(200).json({
        message: 'sucess',
        data: posts
      })
  
    } catch (error) {
      res.status(500).json({
        message: 'failed',
        error: error
      })
    }
  
  }

module.exports = {
    doCreatePost,
    doDeletePost,
    doGetPosts
}