const Blog = require("../models/blogs");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets req.user

    // Total stats
    const totalPosts = await Blog.countDocuments();
    const totalLikes = await Blog.aggregate([{ $project: { likesCount: { $size: "$likes" } } }, { $group: { _id: null, total: { $sum: "$likesCount" } } }]);
    const totalComments = await Blog.aggregate([{ $project: { commentsCount: { $size: "$comments" } } }, { $group: { _id: null, total: { $sum: "$commentsCount" } } }]);
    const totalSavedPosts = await Blog.countDocuments({ savedBy: userId });

    // Liked posts
    const likedPosts = await Blog.find({ likes: userId }).populate("postedBy", "name email");

    // Saved posts
    const savedPosts = await Blog.find({ savedBy: userId }).populate("postedBy", "name email");

    // Performance of user's posts
    const userPosts = await Blog.find({ postedBy: userId }).select("title likes comments");
    const postPerformance = userPosts.map(post => ({
      title: post.title,
      likes: post.likes.length,
      comments: post.comments.length,
    }));

    // Categorization
    const categoryData = await Blog.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);

    res.json({
      totalPosts,
      totalLikes: totalLikes[0]?.total || 0,
      totalComments: totalComments[0]?.total || 0,
      totalSavedPosts,
      likedPosts,
      savedPosts,
      postPerformance,
      categoryData
    });

  } catch (error) {
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
};
module.exports = {
    getDashboardStats
}
