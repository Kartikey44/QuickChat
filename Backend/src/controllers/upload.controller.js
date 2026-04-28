import User from "../model/user.model.js";

export const uploadImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const name = req.body.name;

    let updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (req.file) {
      updateData.profileimg = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};