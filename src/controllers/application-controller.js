const Application = require("../models/application");
const Job = require("../models/job");
const  jobController  = require("./job-controller");
// ✅ APPLY for a Job
const applyForJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const newApplication = new Application({
      job: jobId,
      applicant: req.user.id, // Assuming user ID is available from auth middleware
      resume,
      coverLetter,
    });

    await newApplication.save();
    
    // Update job's applicants list
    job.applicants.push(req.user.id);
    await job.save();
     await jobController.deleteJobIfFull(jobId);
    res.status(201).json({ message: "Applied successfully", application: newApplication });
  } catch (error) {
    res.status(500).json({ message: "Error applying for job", error: error.message });
  }
};

// ✅ UPDATE Application Status (Admin or Employer can update)
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    const validStatuses = ["Applied", "Shortlisted", "Rejected", "Hired"];

    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();

    res.status(200).json({ message: "Application status updated", application });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};
module.exports = {
     updateApplicationStatus,
      applyForJob
}