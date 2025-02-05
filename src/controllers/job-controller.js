const Job = require("../models/job");
const user = require("../models/user");
// ✅ POST a Job (Only Alumni can post)
const postJob = async (req, res) => {
  try {
    const { title, description, about, company, location, salaryRange, employmentType, category, skillsRequired, experienceLevel, applicationDeadline } = req.body;

    const newJob = new Job({
      title,
      description,
      about,
      company,
      location,
      salaryRange,
      employmentType,
      category,
      skillsRequired,
      experienceLevel,
      applicationDeadline,
      postedBy: req.user.id, // Assuming user ID is available from auth middleware
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Error posting job", error: error.message });
  }
};

// ✅ GET all Jobs
const getAllJobs = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const jobs = await Job.find({postedBy: {$ne: loggedInUserId}}).populate("postedBy", "name email"); // Populate user details
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
};

// ✅ GET a Single Job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error: error.message });
  }
};
const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job and populate the applicants' details
    const job = await Job.findById(jobId).populate("applicants", "name email");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      jobTitle: job.title,
      applicants: job.applicants,
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all jobs where the user is in the applicants list
    const jobs = await Job.find({ applicants: userId }).populate("postedBy", "name email");

    res.status(200).json({
      success: true,
      appliedJobs: jobs,
    });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const deleteJobIfFull = async (jobId) => {
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      console.log("Job not found.");
      return;
    }

    // If job has reached max applicants, delete it
    if (job.applicants.length >= job.maxApplicants) {
      await Job.findByIdAndDelete(jobId);
      console.log(`Job ${jobId} deleted as it reached max applicants.`);
    }
  } catch (error) {
    console.error("Error deleting job:", error);
  }
};
const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id; // Authenticated user

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if the logged-in user is the one who posted the job
    if (job.postedBy.toString() !== userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this job" });
    }

    // Delete the job
    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  postJob,
  
  
  
  getAllJobs,
  getJobById,
  getJobApplicants,
  getUserAppliedJobs,
  deleteJobIfFull,
  deleteJob
};
