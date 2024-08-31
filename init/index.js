const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to mongoDBs");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // await Listing.deleteMany({});
    // initData.data = initData.data.map((obj)=>({...obj,owner:"66cda0f29c6db7ff5d3f0469"}))
    let save = await Listing.insertMany(initData.data);
    console.log(save);
    console.log("Data was intilized");
}

initDB();