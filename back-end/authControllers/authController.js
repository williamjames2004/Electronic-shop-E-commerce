const User = require("../models/User");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, userId, age, password, confirmPassword } = req.body;

    if (!fullName || !email || !userId || !age || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existingEmail = await User.findOne({ email });
    const existingUserId = await User.findOne({ userId });

    if (existingEmail) return res.status(400).json({ message: "Email already registered" });
    if (existingUserId) return res.status(400).json({ message: "UserID already taken" });

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = new User({
      fullName,
      email,
      userId,
      age,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful!", success: true, newUser });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    return res.status(200).json({ message: "Login successful!", user: user.userId });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getdata = async (req,res) => {
  try{
    const {userId} = req.params;
    const user = await User.findOne({userId});
    if(!user) return res.status(404).json({message: "No user found"});

    return res.status(201).json({username: user.fullName});
  } catch (error){
    console.error("Error in fetching data: ", error.message);
    return res.status(500).json({message: "Error in fetching data: ", error: error.message});
  }
}

module.exports = { registerUser, loginUser, getdata };