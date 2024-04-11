const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }], 
  refreshToken: String,
  roles: {
    User: {
      type: Number,
      default: 1099
    },
    Editor: Number,
    Admin: Number
  }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hashSync(this.password, salt)

  this.password = hashedPwd
  
  return next();
});

userSchema.methods.comparePassword = async function (pwd) {
  return await bcrypt.compareSync(pwd, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = { User };
