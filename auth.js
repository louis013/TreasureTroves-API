const jwt = require("jsonwebtoken");

const secret = "EcommerceAPI";

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