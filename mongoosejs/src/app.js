const mongoose = require("mongoose");
const validator = require("validator");

// database creation
mongoose
  .connect("mongodb://localhost:27017/RvData")
  .then(() => console.log("connection successful..."))
  .catch((err) => console.log(err));

// schema amd modal for valiadation
const identitySc = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    minlength: [3, "atleast 3 letter"],
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) throw new Error("age should not be negative");
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  gender: String,
  DOB: {
    type: Date,
    default: Date.now,
  },
  active: Boolean,
});

//------ Collection creation
const Identity = new mongoose.model("Indentity", identitySc);

//------ create and insert document

const createDocument = async () => {
  // try{
  //     const rv = new Identity({
  //         name:"adarsh",
  //         age: 18,
  //         gender :"male",
  //         active : true
  //     });

  //      const result = await rv.save();
  //      console.log(result);
  // }catch(err){
  //     console.log(err);
  // }

  try {
    const deepa = new Identity({
      name: "deepa",
      age: 21,
      gender: "male",
      active: true,
    });
    const anjali = new Identity({
      name: "anjali",
      age: 20,
      gender: "female",
      active: true,
    });

    const result = await Identity.insertMany([deepa, anjali]);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
};

// createDocument();

//---- Read Operation
const getDocument = async () => {
  const result = await Identity.find().select({ name: 1 }).limit(1);
  console.log(result);
};

// getDocument();

//-----extra Query

//Comparision :- $eq $gt $gte $in $lt $lte $ne $nin
const getQuery = async () => {
  // const result = await Identity.find({age : {$gte : 20}}).select({name:1});
  const result = await Identity.find({
    gender: { $in: ["male", "female"] },
  }).select({ name: 1 });
  console.log(result);
};

// getQuery();

//Logical :- $and $not $nor $or $ $
const getQuery2 = async () => {
  const result = await Identity.find({
    $or: [{ age: 20 }, { active: false }],
  }).select({ gender: 1 });
  console.log(result);
};

// getQuery2();

//.countdocuments();
//.sort({name :1 or -1})

const updateDocument = async (id) => {
  try {
    const result = await Identity.updateOne(
      { _id: id },
      {
        $set: {
          age: 22,
        },
      }
    );

    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
//updateOne can be replace by findByIdAndUpdate
// updateDocument("614a2276ba40c95e40302f0e");

const updateDelete = async (id) => {
  try {
    const result = await Identity.deleteOne({ _id: id });

    console.log(result);
  } catch (err) {
    console.log(err);
  }
};
//deleteOne can be replace by findByIdAndDelete to find that which data was deleted
// updateDelete("614a2276ba40c95e40302f0e");
