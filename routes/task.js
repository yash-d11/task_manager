const mongoose  = require("mongoose")


const taskSchema = mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low',
    },
    status:{
        type:String,
        enum:['complete','pending'],
        default:'pending'
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  })

  module.exports = mongoose.model('task', taskSchema)