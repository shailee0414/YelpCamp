const Campground = require("../models/campGround");
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, Descriptors } = require("./seedHelpers");
mongoose.set("strictQuery", true); // value stored in db which is specified in schema when it ste to be true;

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

const seedsDb = async () => {
  await Campground.deleteMany({});
  
  for (let i = 1; i < 10; i++) {
    const price=Math.floor(Math.random()*20)+10;
    const camp = new Campground({
      location: `${cities[i]?.country}`,
      title: `${(places[i], Descriptors[i])}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit Commodi nihil quod quidem repellat excepturi neque repellendus quia, facilis et! Hic labore maxime veniam, maiores commodi aut blanditiis ut dolorum inventore.",
        price:price
    });
    await camp.save();
  }
};

seedsDb().then(() => {
  mongoose.connection.close();
});
