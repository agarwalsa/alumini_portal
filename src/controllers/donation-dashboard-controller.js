const Donation = require("../models/Donation");
const DonationRequest = require("../models/donationrequest");
const User = require("../models/User");

// Get donation dashboard data
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user

    // 🏆 Top Donors (Sorted by total donation amount)
    const topDonors = await Donation.aggregate([
      { $group: { _id: "$donor", totalDonated: { $sum: "$amountDonated" } } },
      { $sort: { totalDonated: -1 } },
      { $limit: 5 }, // Get top 5 donors
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "donorInfo"
        }
      },
      { $unwind: "$donorInfo" },
      { $project: { _id: 0, donor: "$donorInfo.name", totalDonated: 1 } }
    ]);

    // 📌 Donations requested by me
    const myRequests = await DonationRequest.find({ createdBy: userId }).populate("verifiedBy", "name");

    // 💰 Donations done by me
    const myDonations = await Donation.find({ donor: userId }).populate({
      path: "donationRequest",
      select: "title amountRequired deadline"
    });

    res.json({
      topDonors,
      myRequests,
      myDonations
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getDashboard };