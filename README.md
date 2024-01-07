# API endpoints

## Authentication
<ul>
<li>

### GET /api/v1/auth/
<b> Description : </b> to check whether service is running . 

</li>
<br>
<li>

### POST /api/v1/auth/
<b> Description : </b> to sign up or login . <br>
<b> Parameters : </b>
| Parameter  | Description |
| ------------- | ------------- |
| phone  | mobile number of user with country code  |

</li>
<br>
<li>

### POST /api/v1/auth/verify
<b> Description : </b> to verify the otp of user. <br>
<b> Parameters : </b>
| Parameter  | Description |
| ------------- | ------------- |
| phone  | mobile number of user with country code  |
| otp | otp sent to the user |

</li>
<br>
<li>

### GET /api/v1/auth/me
<b> Description : </b> to verify the authenticity of user. <br>
<b> Parameters : </b>
| Parameter  | Description |
| ------------- | ------------- |
| Header | Authorization : Bearer JWTToken  |

</li>

<br>
<br>

# Structure of .env file 

```
PORT = 4000
MONGODB_URI=mongodb+srv://username:password@cluster0.uws21.mongodb.net/test
NODE_ENV = development

JWT_SECRET = YOUR_SECRET
ORIGIN = http://localhost:3000

ADMIN_PHONE = TAKE_FROM_TWILIO

TWILIO_ACCOUNT_SID = TAKE_FROM_TWILIO
TWILIO_AUTH_TOKEN = TAKE_FROM_TWILIO
TWILIO_MESSAGE_SERVICE_SID = TAKE_FROM_TWILIO
TWILIO_PHONE = TAKE_FROM_TWILIO

```

<br>
<br>

# Steps to run server 

<li> Create a mongoDB account and take URL from there . </li>
<li> Create twilio account and add detqails to .env file </li>
<li> Add .env file to the main folder </li>
<li> Run 

```
npm install
npm start
```

</li>


