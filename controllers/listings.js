const Listing = require("../models/listing.js");
const tt = require("@tomtom-international/web-sdk-services/dist/services-node.min.js");

module.exports.index = async (req, res) => {
  const { filter } = req.query;

  const filterMap = {
    all: {},
    trending: { views: { $gte: 5 } }, // Adjust the threshold for trending as needed
    rooms: { category: "Rooms" },
    temple: { category: "Temple" },
    cities: { category: "Cities" },
    mountains: { category: "Mountains" },
    castles: { category: "Castles" },
    camping: { category: "Camping" },
    arctic: { category: "Arctic" },
    farms: { category: "Farms" },
    domes: { category: "Domes" },
    boats: { category: "Boats" },
  };
  let query = filterMap[filter] || {};
  let sortCriteria = { createdAt: -1, views: -1 };

  if (filter === "trending") {
    sortCriteria = { views: -1 }; // Sort by view count in descending order
  }

  let allListing = await Listing.find(query)
    .populate("owner")
    .sort(sortCriteria);

  res.render("listings/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const apiKey = process.env.MAP_API_KEY;
  const geocodeResponse = await tt.services.geocode({
    key: apiKey,
    query: req.body.listing.location,
    limit: 1,
  });

  const type = geocodeResponse.results[0].type;
  const { lat, lng } = geocodeResponse.results[0].position;
  const geoJsonData = {
    position: {
      type: "Point",
      coordinates: [lng, lat], // Note: GeoJSON uses [lng, lat]
    },
  };

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  console.log(newListing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.position = geoJsonData.position;
  let save = await newListing.save();
  console.log(save);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
