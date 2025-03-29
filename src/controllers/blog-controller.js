const Blog = require('../models/blogs');


// create a new blog
const createBlog = async(req,res)=>{
    try {
        const { title, subtitle, content, category, coverPhoto, postedBy } = req.body;
        const blog = new Blog({ title, subtitle, content, category, coverPhoto, postedBy });
        await blog.save();
        res.status(201).json(blog);
      } catch (error) {
        res.status(500).json({ error: "Error creating blog" });
      }
};

// get all blogs
const getAllBlogs = async(req,res)=>{
    try {
        const blogs = await Blog.find().populate("postedBy", "name email");
        res.status(200).json(blogs);
      } catch (error) {
        res.status(500).json({ error: "Error fetching blogs" });
      }
};

//get a single blog by id
const getblogbyid = async(req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id).populate("postedBy", "name email");
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json(blog);
      } catch (error) {
        res.status(500).json({ error: "Error fetching blog" });
      }
};


//updating a current blog
const updateBlog = async(req,res)=>{
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json(blog);
      } catch (error) {
        res.status(500).json({ error: "Error updating blog" });
      }
};

//deleting a particular blog
const deleteBlog = async(req,res)=>{
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json({ message: "Blog deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting blog" });
      }
};

//liking a particular blog
const likeBlog = async(req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
    
        if (!blog.likes.includes(req.body.userId)) {
          blog.likes.push(req.body.userId);
          await blog.save();
        }
        res.status(200).json(blog);
      } catch (error) {
        res.status(500).json({ error: "Error liking blog" });
      }    
};

//comment on a particular blog
const addComment = async(req,res)=>{
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
    
        const comment = { user: req.body.userId, text: req.body.text };
        blog.comments.push(comment);
        await blog.save();
        res.status(200).json(blog);
      } catch (error) {
        res.status(500).json({ error: "Error commenting on blog" });
      }
};

const saveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const userId = req.body.userId;
    if (blog.savedBy.includes(userId)) {
      // If already saved, remove from saved
      blog.savedBy = blog.savedBy.filter(id => id.toString() !== userId);
    } else {
      // Else, add to saved
      blog.savedBy.push(userId);
    }
    await blog.save();
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Error saving blog" });
  }
};

module.exports = {
createBlog,
getAllBlogs,
getblogbyid,
deleteBlog,
updateBlog,
addComment,
likeBlog,
saveBlog
};