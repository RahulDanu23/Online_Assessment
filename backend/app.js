require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const app = express();
const cors = require('cors');

const PORT = 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

app.get("/", (req, res) => {
  res.send("Server Working");
})

app.listen(PORT, ()=> {
  console.log(`Server is running at ${PORT}`);
})
connectDB();