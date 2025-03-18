const DonationRequest = require("../models/donationrequest");
const upload = require("../middlewares/upload2");

const createDonationRequest = async(req,res)=>{
    try{
    const { title, description, amountRequired, deadline, createdBy } = req.body;
    const supportingDocuments = req.files.map(file => `/uploads/${file.filename}`);
    const donationRequest = new DonationRequest({
        title,
        description,
        amountRequired,
        deadline,
        createdBy,
        supportingDocuments
      });
  
      await donationRequest.save();
      res.json({ message: "Donation request submitted for approval", donationRequest });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  const approveOrRejectDonationRequest = async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status, adminRemarks } = req.body;
      const adminId = req.user.id; // Assuming admin is authenticated
  
      // Validate status input
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });
      }
  
      const donationRequest = await DonationRequest.findById(requestId);
      if (!donationRequest) {
        return res.status(404).json({ message: "Donation request not found" });
      }
  
      if (donationRequest.status !== "pending") {
        return res.status(400).json({ message: "This donation request has already been processed." });
      }
  
      // Update status and admin remarks
      donationRequest.status = status;
      donationRequest.adminRemarks = adminRemarks;
      donationRequest.verifiedBy = adminId;
      await donationRequest.save();
  
      res.json({ message: `Donation request ${status} successfully`, donationRequest });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  module.exports = { 
    createDonationRequest,
    approveOrRejectDonationRequest 
  };