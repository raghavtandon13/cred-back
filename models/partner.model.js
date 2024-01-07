const { model, Schema } = require("mongoose");

const partnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    apiLink: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("Partner", partnerSchema);
