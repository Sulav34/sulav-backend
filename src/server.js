const express = require("express");
const env = require("dotenv");
const path = require("path");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const connectDB = require("./config/db");
const GlobalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const userRoute = require("./routes/userRoutes");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoutes");
const userImageUpload = require("./routes/userImageUploadRoute");
const productImageUpload = require("./routes/productUploadRoute");

const app = express();

env.config();

connectDB();

// Set security HTTP headers
app.use(helmet());

// Body parser
app.use(cors());
app.use(express.json());

// connects with frontend

app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

//routes
app.use("/api/users", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/upload", userImageUpload);
app.use("/api/multipleuploads", productImageUpload);

// to see static files
// http:localhost:5000/img/users/${filename}
// OR http:localhost:5000/img/products/${filename}
app.use(express.static("public"));

// Global error handling Middleware
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(GlobalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}...`
      .yellow.bold
  );
});
