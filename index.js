require("express-async-errors")
const path = require("path")
require("dotenv").config({ path: path.join(__dirname, ".env") })
require("./DB/index.js")()
const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const morgan = require("morgan")
const { readdirSync } = require("fs")
const errorHandler = require("./middlewares/errorhandler.js")
const AppError = require("./errors/app-error.js")
const passport = require("passport")
const session = require('express-session');
const bodyParser = require('body-parser');

// require("./cron/crons.js")()

// passport config
require('./config/passport.js')(passport);

const app = express()

// Middleware
app.use(cookieParser())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express session
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/blogs", require("./routes/blogs"));
app.use("/api/v1/bookings", require("./routes/bookings"));
app.use("/api/v1/payments", require("./routes/payments"));
app.use("/api/v1/payment", require("./routes/payments")); // Alias for singular form
app.use("/api/v1/leagues", require("./routes/leagues.js"));
app.use("/api/v1/queries", require("./routes/queries"));
app.use("/api/v1/fields", require("./routes/field.js"));
app.use("/api/v1/users", require("./routes/users"));

app.get("/", (req, res) => {
  res.send("Welcome to BOFA API v1")
})

app.all("*", () => {
  throw new AppError("not found", 404)
})

// Error handling
app.use(errorHandler)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(
    `*************************** \nSERVER RUNNING ON PORT ${PORT} \n***************************`
  )
})
