const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { select } = require('../middleware/redis');

const { Schema } = mongoose;

const petSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, default: 1 },
  sex: { type: String, required: true, enum: ['남', '여'] },
  type: { type: String, required: true, enum: ['강아지', '고양이'] },
  breed: { type: String, required: true },
  size: { type: String, required: true, default: '소형', enum: ['소형', '중형', '대형'] },
  weight: { type: Number, required: true }
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    // select: false
  },
  nick: { type: String, required: true },
  phone: { type: String },// required: true
  admin: { type: Boolean, required: true, default: false },
  pets: [petSchema],
  code: { type: String, select: false }
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

userSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      })
    })
  }
  else {
    next();
  }
});

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this;
  const modifiedField = this.getUpdate().password;

  if (!modifiedField) {
    return next();
  }
  try {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(modifiedField, salt, function (err, hash) {
        if (err) return next(err);
        user.getUpdate().password = hash
        next();
      })
    })
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;