require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/database");
const fileUpload = require("express-fileupload");
const {cloudinaryConnect} = require("./config/cloudinary");
const cors = require("cors");

const userRoutes = require("./routes/User");
const authRoutes = require("./routes/Auth");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payment");
const courseRoutes = require("./routes/Course");


const app = express();
const PORT = process.env.PORT;


//middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({                   //for entertaing http request from frontend
    origin:"http://localhost:3000",
    credentials: true, //allows cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}));


//routes mounting
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);


dbConnect();
cloudinaryConnect();


app.get("/", (req, res)=> {
    return res.json({
      success: true,
      message: "Your server is up and running...."
    })
});


app.listen(PORT, ()=> {
    console.log(`Server started successfully ar ${PORT} !`);
});
