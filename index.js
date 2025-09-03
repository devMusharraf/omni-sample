const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/lookupPractice");

const citySchema = new mongoose.Schema({
  name: String,
});
const City = mongoose.model("City", citySchema);

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
});

const User = mongoose.model("User", userSchema);


await City.deleteMany();
await User.deleteMany();

const ny = await City.create({ name: "New York"});
const la = await City.create({ name: "Los Angeles"});

const newData = await User.create([
    { name: "Alice", age: 25, city: ny._id},
    { name: "Bob", age: 30, city: la._id},
    { name: "Charlie", age: 22, city: ny._id }
])
  console.log("✅ Sample data inserted!\n", newData);


  const usersWithCity = await User.find().populate("city");
  console.log(usersWithCity)

  const joined = await User.aggregate([
    {
        $lookup: {
            from: "cities",
            localField: "city",
            foreignField: "._id",
            as: "cityDetails",
        }
    }
  ])
  console.log(JSON.stringify(joined, null, 2))
  }
  main()