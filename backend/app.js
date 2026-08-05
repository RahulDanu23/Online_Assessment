const express = require('express');
const app = express();


const PORT = 3000;

app.use(express.urlencoded({ extended: true}));


app.use("/", (req, res) => {
  res.send("Server Working");
})

app.listen(PORT, ()=> {
  console.log(`Server is running at ${PORT}`);
})