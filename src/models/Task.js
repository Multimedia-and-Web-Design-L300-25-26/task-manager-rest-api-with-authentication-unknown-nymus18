import mongoose from "mongoose";

// Create Task schema
// Fields:
// - title (String, required)
// - description (String)
// - completed (Boolean, default false)
// - owner (ObjectId, ref "User", required)
// - createdAt (default Date.now)

const taskSchema = new mongoose.Schema({
  title:{
    type:String,
    required:[true,"Please provide title"],
    trim:false
  },
  description:{
    type:String,
    trim:false
  },
  completed:{
    type:Boolean,
    default:false,
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:[true,"Please provide User"]
  }
},{timestamps:true});

const Task = mongoose.model("Task", taskSchema);

export default Task;