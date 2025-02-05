const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    enrollmentNumber: {
        type: String,
        required: true,
        unique: true
    },
    yearOfPassout:{
        type: Number,
        required: true
    },
    collegeName:{
        type: String,
        required: true
    },
    mobileNumber:{
        type: String,
        required: true
    },
    currentSemester:{
        type: Number
    },
    workingOrganisation:{
        type: String
    },
    role: {
        type: String,
        enum: ['student','alumini','admin'],
        required: true
    },
    profilePicture:{
        type: String
    },
    isVerifiedAlumini:{
        type: Boolean,
        default: false
    },

});
userSchema.pre('save',async function (next){
    if(!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});
module.exports = mongoose.model('User',userSchema);