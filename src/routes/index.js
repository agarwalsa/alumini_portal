const express = require('express');
const upload = require('../middlewares/upload');
const userController = require('../controllers/user-controller');
const applicationController = require('../controllers/application-controller');
const jobController = require('../controllers/job-controller');
const verifyAlumni = require('../middlewares/verifyAlumini');
const verifyAdmin = require('../middlewares/verifyAdmin');
const auth = require('../middlewares/auth');
const donationDashboard = require('../controllers/donation-dashboard-controller');
const donationController = require('../controllers/donation-controller');
const blogController = require('../controllers/blog-controller');
const blogsDashboard = require('../controllers/blogs-dashboard-controller');
const messageController = require('../controllers/message-controller');
const router = express.Router();
const Messageupload = require('../middlewares/messageupload');
router.post('/register',upload.single('profilePicture'),userController.registerUser);
router.post('/login',userController.loginUser);
router.post('/post',auth.Auth,verifyAlumni.verifyAlumni,jobController.postJob);
router.get('/applied',auth.Auth,jobController.getUserAppliedJobs);
router.get('/:jobId/applicants',auth.Auth,jobController.getJobApplicants);
router.get('/all',jobController.getAllJobs);
router.get('/:jobid',jobController.getJobById);
router.delete('/delete/:jobId',auth.Auth,jobController.deleteJob);
router.post('/apply',auth.Auth,applicationController.applyForJob);
router.put('/modify',applicationController.updateApplicationStatus);
router.get('/dashboard',donationDashboard.getDashboard);
router.post('/create',donationController.createDonationRequest);
router.put('/:requestId',verifyAdmin.verifyAdmin,donationController.approveOrRejectDonationRequest);
router.post('/postBlog',blogController.createBlog);
router.get('/allblogs',blogController.getAllBlogs);
router.get('/:blogId',blogController.getblogbyid);
router.put('/modifyBlog',blogController.updateBlog);


router.post('/:id/like',blogController.likeBlog);
router.post('/:id/comment',blogController.addComment);
router.delete('/:id',blogController.deleteBlog);
router.post('/:id/save',blogController.saveBlog);



router.get('/blogDashboard',auth.Auth,blogsDashboard.getDashboardStats);



router.post('/send',auth.Auth,Messageupload.single('file'),messageController.sendMessage);
router.get('/messages/:userId',auth.Auth,messageController.getMessages);
router.get('/unread',auth.Auth,messageController.getUnreadCount);
router.get('/contacts',auth.Auth,messageController.getContacts);
module.exports = router;
