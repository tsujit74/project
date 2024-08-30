const User = require('../models/user');
const Listing = require('../models/listing');

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Singned Sucessfully!");
            res.redirect("/listings");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in.");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.profile = async(req,res)=>{
    const currUser = req.user; // Assuming you have the current user in `req.user`
    
    // Find all listings owned by the current user
    const allListings = await Listing.find({ owner: currUser._id })
      .populate({ path: 'reviews', populate: { path: 'author' } })
      .populate('owner');
    let allListing = await Listing.find({}).populate("owner").sort({createdAt:-1});
    res.render("users/profile.ejs",{allListing,allListings,currUser});
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}