const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')


mongoose.connect('mongodb://0.0.0.0/taskManager')

const userSchema = mongoose.Schema({
  username:{
    type:String,  
    required: [ true,],
    unique: [ true,]
  },
  
  },
)

userSchema.plugin(plm)

module.exports = mongoose.model('user', userSchema)