const jwt = require("jsonwebtoken");

const secret = "ECommerceAPI";

// Token Creation
module.exports.createAccessToken = (user) => {

    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    // The sign() function is responsible for creating a token using the user data, secret key, and options/modifiers for the token (which is represented by the empty object)
    return jwt.sign(data, secret, {});
}

// Token verification
module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);
    let token = req.headers.authorization;
    // console.log("This is the token", token);

    if(typeof token === "undefined") {
        return res.send({auth: "Failed. No Token"})
    }
    else {

        console.log(token);
        token = token.slice(7, token.length);
        console.log(token);

        // Token decryption
        jwt.verify(token, secret, function(err, decodedToken) {

            if(err) {
                return res.send({
                    auth: "Failed",
                    message: err.message
                })
            }
            else {
                console.log("Result from the verify method:");
                console.log(decodedToken);

                req.user = decodedToken;

                next();
            }
        })
    }
}

module.exports.verifyAdmin = (req, res, next) => {
    console.log("Result from verifyAdmin method:");
    console.log(req.user);

    // Checks if the owner of the token is an admin
    if(req.user.isAdmin) {
        // Move to the next middleware
        next();
    }
    // If not admin, send the status and message
    else {
        return res.status(403).send({
            auth: "Falied",
            message: "Action Forbidden"
        });
    }
}