const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
userName:{
    type:String,
    required: true,
},
userEmail:{
    type:String,
    required: true,
},
userPassword:{
    type:String,
    required: true,
}
});
module.exports = mongoose.model('User',userSchema);