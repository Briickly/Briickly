import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
       type: String,
       default: "https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    adminPasscode: {
      type: String,
      default: ""
    },
  }, { timestamps: true });
  
// Create a static method to check if a user is an admin
userSchema.statics.isAdminEmail = async function(email) {
  const adminEmail = process.env.ADMIN_EMAIL || "x@x";
  return email === adminEmail;
};

const User = mongoose.model('User', userSchema);

export default User;