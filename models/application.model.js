const { Schema, model, Types } = require("mongoose");

const loanApplicationSchema = new Schema({
  user: { type: Types.ObjectId, ref: "User", required: true },
  partner: { type: Types.ObjectId, ref: "Partner", required: true },
  responseData: { type: Schema.Types.Mixed, default: {} }
});

module.exports = model("LoanApplication", loanApplicationSchema);
