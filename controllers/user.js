const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// Register User
module.exports.registerUser = (req, res) => {

    if(!req.body.email.includes("@")) {
        return res.status(400).send({error: "Email invalid"});
    }
    else if(req.body.password.length < 8) {
        return res.status(400).send({error: "Password must contain at least 8 characters"});
    }
    else if(req.body.mobileNo.length !== 11) {
        return res.status(400).send({error: "Mobile number invalid"});
    }
    else {

        let newUser = new User({
            firstName: req.body.firstName,
    		lastName: req.body.lastName,
    		email: req.body.email,
    		mobileNo: req.body.mobileNo,
    		password: bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((savedUser) => res.status(201).send({message: "Registered Successfully"}))
        .catch(err => {
            console.error("Error in registering: ", err);
            res.status(500).send({error: "Error in registering"});
        })
    }
};

// Login User
module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")) {
        return User.findOne({email: req.body.email})
        .then(access => {

            if(access == null) {

                return res.status(404).send({error: "No email found"});
            }
            else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, access.password);

                if(isPasswordCorrect){
					return res.status(200).send({access: auth.createAccessToken(access)});
				} 
                else {
					return res.status(401).send({error: 'Email and password do not match'});
				}
            }
        })
        .catch(err => {
            console.error("Error in find: ", err);
            res.status(500).send({error: "Error in find"})
        })
    }
    else {
        return res.status(400).send({error: "Invalid email"});
    }
};

module.exports.updatePassword = async (req, res) => {
    try {
		const { newPassword } = req.body;
		const { id } = req.user; // Extracting user ID from the authorization header
	
		// Hashing the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);
	
		// Updating the user's password in the database
		await User.findByIdAndUpdate(id, { password: hashedPassword });
	
		// Sending a success response
		res.status(200).json({ message: 'Password updated successfully' });
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};