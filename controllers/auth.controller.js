const User = require("../models/user.model");

const { PHONE_NOT_FOUND_ERR, PHONE_ALREADY_EXISTS_ERR, USER_NOT_FOUND_ERR, INCORRECT_OTP_ERR } = require("../errors");

// set expiration time for otp
const EXPIRATION_TIME = 5 * 60 * 1000;
// set otp length
const OTP_LENGTH = 4;

const { createJwtToken } = require("../utils/token.util");

const { generateOTP, fast2sms } = require("../utils/otp.util");

// --------------------- create new user ---------------------------------

exports.createNewUser = async (req, res, next) => {
  try {
    let { phone } = req.body;
    let { name } = req.body;
    let { pan } = req.body;
    let { dob } = req.body;
    let { email } = req.body;
    let { addr } = req.body;
    let { category } = req.body;
    let { gender } = req.body;
    let { employment } = req.body;
    let { loan_required } = req.body;
    let { residence_type } = req.body;
    let { income } = req.body;
    let { credit_required } = req.body;
    let { company_name } = req.body;

    // check duplicate phone Number
    const phoneExist = await User.findOne({ phone });

    if (phoneExist) {
      next({ status: 400, message: PHONE_ALREADY_EXISTS_ERR });
      return;
    }

    // create new user
    const createUser = new User({
      phone,
      name: name,
      pan: pan,
      dob: dob,
      email: email,
      addr: addr,
      category: category,
      gender: gender,
      employment: employment,
      loan_required: loan_required,
      residence_type: residence_type,
      income: income,
      credit_required: credit_required,
      company_name: company_name,
      role: phone === process.env.ADMIN_PHONE ? "ADMIN" : "USER",
    });

    // save user
    const user = await createUser.save();

    // generate otp
    const otp = generateOTP(OTP_LENGTH);
    console.log("OTP:", otp);
    // save otp to user collection
    user.phoneOtp = otp;
    user.phoneOtpExpire = Date.now() + EXPIRATION_TIME;
    await user.save();
    // send otp to phone number
    contactNumber = user.phone;
    await fast2sms(otp, contactNumber, next);

    res.status(200).json({
      type: "success",
      message: "Account created OTP sent to mobile number",
      data: {
        userId: user._id,
      },
    });
  } catch (error) {
    next({ message: error.message, status: 500 });
  }
};

// ---------------------- get auth for any user ------------------------
exports.get_auth = async (req, res, next) => {
  ////console.log(req.body);
  try {
    const { phone } = req.body;
    console.log("Phone: ", phone);

    const user = await User.findOne({ phone });
    ////console.log("new user");
    if (!user) {
      ////console.log("user not found creating new");
      // create new user
      await this.createNewUser(req, res, next);
    } else {
      // //console.log("user found login with otp");
      // login user
      // //console.log(req.body);
      await this.loginWithPhoneOtp(req, res, next);
    }
  } catch (error) {
    next({ message: error.message, status: 500 });
  }
};

// ------------ login with phone otp ----------------------------------

exports.loginWithPhoneOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const { name } = req.body;
    const { pan } = req.body;
    const { dob } = req.body;
    const { email } = req.body;
    const { addr } = req.body;
    const { category } = req.body;
    const { gender } = req.body;
    const { employment } = req.body;
    const { loan_required } = req.body;
    const { residence_type } = req.body;
    const { income } = req.body;
    const { credit_required } = req.body;
    const { company_name } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      next({ status: 400, message: PHONE_NOT_FOUND_ERR });
      return;
    }

    // //console.log(req.body);

    // generate otp
    const otp = generateOTP(OTP_LENGTH);
    console.log("OTP:", otp);
    // save otp to user collection
    user.phoneOtp = otp;
    user.phoneOtpExpire = Date.now() + EXPIRATION_TIME;
    user.isAccountVerified = true;
    user.name = name;
    user.addr = addr;
    user.pan = pan;
    user.dob = dob;
    user.email = email;
    user.category = category;
    user.gender = gender;
    user.loan_required = loan_required;
    user.employment = employment;
    user.residence_type = residence_type;
    user.income = income;
    user.credit_required = credit_required;
    user.company_name = company_name;
    //console.log(user);
    await user.save();
    // send otp to phone number
    contactNumber = user.phone;
    await fast2sms(
      otp,
      contactNumber,
      next(
        res.status(201).json({
          type: "success",
          message: "OTP sent to your registered phone number",
          data: {
            userId: user._id,
          },
        }),
      ),
    );
  } catch (error) {
    //console.log(error);
    next({ message: error.message, status: 500 });
  }
};

// ----------------------- resend otp ------------------------------
exports.resendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      next({ status: 400, message: PHONE_NOT_FOUND_ERR });
      return;
    }

    // generate otp
    const otp = generateOTP(OTP_LENGTH);
    // save otp to user collection
    user.phoneOtp = otp;
    user.phoneOtpExpire = Date.now() + EXPIRATION_TIME;
    await user.save();

    // send otp to phone number
    contactNumber = user.phone;
    await fast2sms(otp, user.phone, next);
    res.status(201).json({
      type: "success",
      message: "OTP sent to your registered phone number",
      data: {
        userId: user._id,
      },
    });
  } catch (error) {
    next({ message: error.message, status: 500 });
  }
};

// ---------------------- verify phone otp -------------------------

exports.verifyPhoneOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    //console.log(user, phone, otp);
    if (!user) {
      next({ status: 400, message: USER_NOT_FOUND_ERR });
      return;
    }

    if (user.phoneOtp !== otp || user.phoneOtpExpire < Date.now()) {
      next({ status: 400, message: INCORRECT_OTP_ERR });
      return;
    }

    const token = createJwtToken({ user: user._id });

    user.phoneOtp = "";
    await user.save();

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    //console.log(error);
    next({ message: error.message, status: 500 });
  }
};

// --------------- fetch current user -------------------------
exports.fetchCurrentUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    return res.status(200).json({
      type: "success",
      message: "fetch current user",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- admin access only -------------------------

exports.handleAdmin = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    return res.status(200).json({
      type: "success",
      message: "Okay you are admin!!",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
