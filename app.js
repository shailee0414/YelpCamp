const express = require("express");
const app = express();
const path = require("path");
const Campground = require("./models/campGround");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN !!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO ERROR !!");
    console.log(err);
  });
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ============================= HOME PAGE===============================

app.get("/", (req, res) => {
  res.render("campground/home");
});

// ============================= LIST OF CAMPGROUND ===============================

app.get("/campground", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
});

// ============================= CREATE NEW CAMPGROUND ===============================

app.get("/campground/new", (req, res) => {
  res.render("campground/new");
});

// ============================= POST NEW CAMPGROUND ===============================

app.post("/campground", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campground/${campground._id}`);
});

// ============================= SHOW THE DETAILS OF CAMPGROUND ===============================

app.get("/campground/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campground/show", { campground });
});

// ============================= EDIT CAMPGROUND ===============================

app.get("/campground/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campground/edit", { campground });
});

// ============================= UPDATE CAMPGROUND ===============================

app.put("/campground/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campground/${campground._id}`);
  } catch (err) {
    return res.send(err);
  }
});

// ============================= DELETE CAMPGROUND ===============================

app.delete("/campground/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campground");
});

// ============================= APP PORT ===============================

app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});
