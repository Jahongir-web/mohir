const express = require("express")
const dotenv = require("dotenv")
const fileUpload = require("express-fileupload")
const path = require("path")
const users = require("./src/modules/user/routes")
const home = require("./src/modules/home/routes")
const admin = require("./src/modules/admin/routes")
const teacher = require("./src/modules/teacher/routes")
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const cors = require('cors')




dotenv.config()

const app = express()

const PORT = process.env.PORT || 4001


app.use(express.json())
app.use(fileUpload())
app.use(express.urlencoded({extended: true}))
app.use(cors())


app.use((_, res, next) => {

	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type, access_token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
	})

	next()
})

app.use(express.static(path.join(__dirname, "src", "static")))

app.use(users)
app.use(home)
app.use("/admin", admin)
app.use("/teacher", teacher)

const GOOGLE_CLIENT_ID = '963699870941-ekuvu9v5sd9590ui6nv2e3slo189bpou.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = 'lZ3qPQe9_T0rJEzexeCegav5'


const FACEBOOK_CLIENT_ID = '238030234853637'
const FACEBOOK_CLIENT_SECRET = '56314ce157eff44f5cbbf0865af03a14'

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://mohir-server.herokuapp.com/google'
}, (accessToken, refreshToken, profile, callback) => {
  callback(null, profile)
}))


passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: 'https://mohir-server.herokuapp.com/facebook',
  profileFields: ['emails', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, callback) => {
  callback(null, profile)
}))


passport.serializeUser((user, callback) => {
  callback(null, user)
})

passport.deserializeUser((user, callback) => {
  callback(null, user)
})



app.listen(PORT, () => console.log(PORT))