require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes/authRoutes');
const app = express();


const PORT = 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use('/api/auth', router);

app.use("/", (req, res) => {
  res.send("Server Working");
})

app.listen(PORT, ()=> {
  console.log(`Server is running at ${PORT}`);
})
connectDB();