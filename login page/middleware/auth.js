const islogin = async (req, res, next) => {
    try {
        if (req.session.userId) {
            // If user is authenticated, proceed to next middleware
            next();
        } else {
            // If user is not authenticated, redirect to login page
            res.redirect("/");
        }
    } catch (error) {
        console.log(error.message);
        // Handle error if needed
    }
};

const islogout = async (req, res, next) => {
    try {
        if (req.session.userId) {
            // If user is authenticated, redirect to home page
            res.redirect("/home");
        } else {
            // If user is not authenticated, proceed to next middleware
            next();
        }
    } catch (error) {
        console.log(error.message);
        // Handle error if needed
    }
};

export {
    islogin,
    islogout
};
