import mongoose from "mongoose";


// Create User schema
// Fields:
// - name (String, required)
// - email (String, required, unique)
// - password (String, required, minlength 6)
// - createdAt (default Date.now)



const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please provide a name"],
    trim:true
  }
  ,email:{
    type:String,
    required:[true,"Please provide an email"],
    trim:true
  },
  password:{
    type:String,
    required:[true,"Please provide a password"],
    minLength:6
  }
},{timestamps:true});

const User = mongoose.model("User", userSchema);

export default User;