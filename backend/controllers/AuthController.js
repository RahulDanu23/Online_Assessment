const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// login
const login = async(req, res) => {
  try{
    const {email, password} = req.body;
    if(!email || !password) {
      return res.status(400).json({
        message: "Email and Password both are required!"
      });
    }

    // user exists or not
    const user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      })
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign({
      id: user._id,
      role: user.role
    }, process.env.JWT_SECRET, {
      expiresIn:"1h"
    });

    return res.status(201).json({
      message: "User logged in successfully ",
      token,
      user: {id: user._id, name: user.name, email: user.email,
        role: user.role
      }
    })

  } catch(error) {
    return res.status(400).json({
      message: "Internal server error"
    })
  }
}

// register
const register = async(req, res) => {
  try {
    const {name, email, password, role} = req.body;

    if(!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email, Password are required!"
      })
    }

    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role : role || 'student'
    });

    newUser.save();
    return res.status(201).json({
      message: "User registered successfully"
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

const logout = async(req, res)=>{
  try {
    return res.status(201).json({
      message: "User logged out successfully"
    })
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

module.exports = {login, register, logout}