const express = require("express");
const app = express();
var cors = require('cors')

const {PORT} = require("./config/config");

const mainRouter = require("./routes/index")

app.use(cors());
app.use(express.json());

app.use("/api/v1",mainRouter);

app.listen(PORT,()=>{
    console.log("Backend is connected to the port number",PORT);
})