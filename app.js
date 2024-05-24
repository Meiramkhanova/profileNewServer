const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes/api/blogs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// use the cors middleware with the
// origin and credentials options
app.use(cors({ origin: true, credentials: true }));

app.use(
  cors({
    origin: [""],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// Middleware to serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// use the body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use the routes module as a middleware
// for the /api/blogs path
app.use("/api/blogs", routes);

//Connect DataBase
connectDB();

app.get("/", (req, res) => res.send("Hello Adina!"));

const port = process.env.port || 8081;

app.listen(port, () => console.log(`Server running on port ${port}`));
