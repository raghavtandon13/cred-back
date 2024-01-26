const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      // unique: true,
    },
    accounts: [
      {
        type: Schema.Types.Mixed,
      },
    ],

    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },

    pan: {
      type: String,
      required: false,
      trim: true,
      // unique: true,
    },
    dob: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    addr: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      required: false,
      trim: true,
    },
    employment: {
      type: String,
      required: false,
      trim: true,
    },
    company_name: {
      type: String,
      required: false,
      trim: true,
    },
    income: {
      type: String,
      required: false,
      trim: true,
    },
    loan_required: {
      type: String,
      required: false,
      trim: true,
    },
    credit_required: {
      type: String,
      required: false,
      trim: true,
    },
    residence_type: {
      type: String,
      required: false,
      trim: true,
    },

    phoneOtp: {
      type: String,
      length: 4,
    },

    phoneOtpExpire: {
      type: Date,
    },

    detailsFilled: {
      type: Boolean,
      default: false,
    },
    google: {
      id: {
        type: String,
      },
      email: {
        type: String,
      },
      name: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

module.exports = model("User", userSchema);
