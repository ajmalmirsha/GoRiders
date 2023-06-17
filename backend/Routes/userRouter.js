const router = require('express').Router()
const { signup, login, updateUser, uploadProfileImage} =  require('../controller/authController')
const { allVehicles, getVehiclesDetails } = require('../controller/ownerController')
const { uploadLisence, addReview, getVehicleData, getAllVehicleDetails, editProductDetails, getAllNotifications, addBooking, getApprovedBookings, paymentUpdation, setMessage, getMessages, getSenderDetails } = require('../controller/userController')
const { userAuthenticator } = require('../middlewares/Auth/auth')
const { uploadOptions, uploadlicense, reviewImage } = require('../middlewares/multer/multer')
require('dotenv').config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});


router.post('/signup',signup)

router.post('/login',login)




router.get('/list-all-vehicle',getAllVehicleDetails)



router.get('/list-all/:vehicle',getVehicleData)






// router.use(userAuthenticator)


router.get("/config", (req, res) => {
  console.log('reached here');
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post("/create-payment-intent", async (req, res) => {
  try {
    console.log('reached create-payment-intent route',req.body.amount);
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "Inr",
      amount: req.body.amount * 100,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log('on chache');
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

router.patch('/payment-success',userAuthenticator,paymentUpdation)

router.get('/get-all-notifications/:role',userAuthenticator,getAllNotifications)

router.post('/add-booking',userAuthenticator,addBooking)

router.post('/update-user',userAuthenticator,updateUser)

router.post('/upload-profile-image',userAuthenticator,uploadOptions.single('image'),uploadProfileImage)

router.get('/vehicle/data/:id',userAuthenticator,getVehiclesDetails)

router.get('/get-all-approved-bookings',userAuthenticator,getApprovedBookings)

router.post('/vehicle/review/add',userAuthenticator,reviewImage.single('image'),addReview)

router.post('/add-license', uploadlicense.fields([
  { name: 'license[front]', maxCount: 1 },
  { name: 'license[back]', maxCount: 1 }
]), uploadLisence);


router.get('/get-owner-details/:userId',getSenderDetails)


//chat routes

router.post('/sent-message',userAuthenticator,setMessage)

router.post('/get-all-messages',userAuthenticator,getMessages)

module.exports = router