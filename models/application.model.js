const { model, Schema, Types } = require("mongoose");
const loanApplicationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Partner",
    required: true,
  },
  responseData: {
    type: Schema.Types.Mixed,
    default: {},
  },
});
