
const { ownerRegister, ownerLogin } = require('../controller/authController')
const { addVehicle, allVehicles, getReviews, deleteVehicleImage, EditVehicleDetials, addVehicleImages, bookingVerifications, verifyBooking, editProductDetails } = require('../controller/ownerController')
const { uploadOptions, uploadlicense } = require('../middlewares/multer/multer')
const { ownerAuthenticator, userAuthenticator } = require('../middlewares/Auth/auth')
const  { setMessage, getMessages, getContacts, ownerNotifications } = require('../controller/userController')
const router = require('express').Router()

router.post('/owner-register', ownerRegister)

router.post('/login', ownerLogin)

router.post('/add-vehicle',ownerAuthenticator, uploadOptions.fields([
    { name: 'rc[front]', maxCount: 1 },
    { name: 'rc[back]', maxCount: 1 },
    { name: 'images', maxCount: 4}
  ]), addVehicle)

router.get('/get-all-vehicles/:id',ownerAuthenticator, allVehicles)

router.get('/get-reviews/:id',ownerAuthenticator, getReviews)

router.post('/delete/vehicle/image/:id/:vehicleId',ownerAuthenticator, deleteVehicleImage)

router.get('/edit-product-details/:id',ownerAuthenticator,editProductDetails)

router.post('/edit-vehicle',ownerAuthenticator, EditVehicleDetials)

router.get('/get-all-booking-verifications',ownerAuthenticator,ownerAuthenticator, bookingVerifications)

router.put('/verify/booking',ownerAuthenticator, verifyBooking)

router.post('/upload-vehicle-images',ownerAuthenticator,uploadOptions.array('images',4), addVehicleImages)

router.post('/sent-message',ownerAuthenticator,setMessage)

router.post('/get-all-messages',ownerAuthenticator,getMessages)

router.get('/get-all-contacts',ownerAuthenticator,getContacts)

router.get('/get-owner-notifications',ownerAuthenticator,ownerNotifications)

module.exports = router