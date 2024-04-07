const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

function validatedEmail(){

}

function validatedPassword(){

}

function validatedName(){

}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"],
        //validate: [validatedName, "Please enter a valid name"],
    },

    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already exist"],
        lowercase: true,
        //validate: [validatedEmail, "Please enter a valid email"]
    },

    password: {
        type: String,
        required: [true, "Please enter your password"],
        //validate: [validatedPassword, "Please enter a valid password"],
        minLength: 6,
        select: false
    },

    avatar: String
});

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;