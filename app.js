const express = require("express");
const app = express();
const path = require("path");
const joi = require("joi");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const {campgroundSchema} = require("./utils/schemas");
const Campground = require("./models/campGround");
const mongoose = require("mongoose");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp", {
    useNewUrlParser: true,
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

// ============================= CAMPGROUND VALIDATION ===============================

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// ============================= HOME PAGE ===============================

app.get("/", (req, res) => {
  res.render("campground/home");
});

// ============================= LIST OF CAMPGROUND ===============================

app.get(
  "/campground",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds });
  })
);

// ============================= CREATE NEW CAMPGROUND ===============================

app.get("/campground/new", (req, res) => {
  res.render("campground/new");
});

// ============================= POST NEW CAMPGROUND ===============================

app.post(
  "/campground",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
  })
);

// ============================= SHOW THE DETAILS OF CAMPGROUND ===============================

app.get(
  "/campground/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campground/show", { campground });
  })
);

// ============================= EDIT CAMPGROUND ===============================

app.get(
  "/campground/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campground/edit", { campground });
  })
);

// ============================= UPDATE CAMPGROUND ===============================

app.put(
  "/campground/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campground/${campground._id}`);
  })
);

// ============================= DELETE CAMPGROUND ===============================

app.delete(
  "/campground/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campground");
  })
);
app.all("*", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong :(";
  res.status(statusCode).render("error", { err });
});

// ============================= APP PORT ===============================

app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});
