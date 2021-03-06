const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { select } = require('../middleware/redis');

const { Schema } = mongoose;

const petSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number },
  sex: { type: String, required: true, enum: ['남', '여'] },
  type: { type: String, required: true, enum: ['강아지', '고양이'] },
  breed: { type: String },
  size: { type: String, required: true, default: '소형', enum: ['소형', '중형', '대형'] },
  weight: { type: Number },
  imageUrl: { type: String },
  isRepresent: { type: Boolean, default: false, required: true }
}, { timestamps: true });

const userSchema = new Schema({
  accountType: { type: String, enum: ['local', 'naver', 'kakao', 'apple'], required: true },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  nick: { type: String, required: true },
  phone: { type: String }, // required: true
  admin: { type: Boolean, required: true, default: false },
  pets: [petSchema],
  tempPassword: { type: String, default: null, select: false }
},
  { timestamps: true },
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
  const modifiedField2 = this.getUpdate().tempPassword;

  if (!modifiedField && !modifiedField2) {
    return next();
  } else if (!modifiedField) {
    try {
      bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(modifiedField2, salt, function (err, hash) {
          if (err) return next(err);
          user.getUpdate().tempPassword = hash
          next();
        })
      })
    } catch (error) {
      return next(error);
    }
  } else
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