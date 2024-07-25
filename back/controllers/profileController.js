import { ProfileModel } from "../models/profile.js";

const createProfile = async (req, res) => {
  try {
    const { firstname, lastname, gender, ethnicity, bio, email, username } =
      req.body;
    const newProfile = new ProfileModel({
      firstname,
      lastname,
      gender,
      ethnicity,
      email,
      username,
      bio,
      postedBy: req.user._id,
    });

    const result = await newProfile.save();
    return res.status(201).json({ success: true, result });
  } catch (error) {
    console.error("Error saving profile:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const results = await ProfileModel.find({ postedBy: req.user._id });

    if (!results) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  console.log("the id from req.params:", id);
  try {
    const result = await ProfileModel.findOneAndUpdate(
      { postedBy: id },
      { ...req.body },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ error: "Profile not found" });
    }
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "No ID specified" });
  }
  try {
    const profile = await ProfileModel.findOne({ postedBy: id });
    if (!profile) {
      return res.status(404).json({ error: "Profile does not exist" });
    }
    return res.status(200).json({
      success: true,
      profile: {
        firstname: profile.firstname,
        lastname: profile.lastname,
        gender: profile.gender,
        bio: profile.bio,
        ethnicity: profile.ethnicity,
        email: profile.email,
        username: profile.username,
        image: profile.image,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

export { createProfile, updateProfile, getProfile, getUserProfile };
