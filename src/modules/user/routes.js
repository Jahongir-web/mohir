const passport = require('passport')
const Router = require("express").Router
const { model } = require("./models")
const { v4 } = require("uuid")
const {sign, verify} = require("../../../function/jwt")
const path = require("path")

const uploadsDir = path.join(__dirname, "../../static/files")

const router = Router()

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const serviceId = process.env.SERVICE_ID

const client = require('twilio')(accountSid, authToken);

router.post("/signup", async (req, res) => {
  const data = req.body
   try{       
    const checkUsername = await model.checkUsername(data)
    const checkPhone = await model.checkPhone(data)
    if(checkUsername){
      res.status(400).send("This is username already exist")
    } else if(checkPhone){
      res.status(400).send("This is phone already exist")
    } 
              
    else{
      client 
      .verify
      .services(serviceId)
      .verifications
      .create({
        to: req.body.phone,
        channel: 'sms'
      })
      .then((info) => {
        res.status(200).send({info, data}) 
      }).catch((err) => res.send(err.message))        
    }        
  }
  catch(err){
    console.log(err)
    res.statusMessage = err
    res.status(401).end()    
  } 
})

router.post("/verify", async (req, res) => {
  try{    
    const data = req.body
    if(data.code){
      
      client
      .verify
      .services(serviceId)
      .verificationChecks
      .create({
         to: data.phone,
         code: data.code
      })
      .then(async (info) => {

        if(info.valid == true){
          const user = await model.signUP(data)
          const accessToken = await sign(user)      
          res.send({token: accessToken}).status(201)  
        }
     
      }).catch((err) => res.send(err.message))
    }
      
  }
  catch(err){

    console.log(err)
    res.statusMessage = err.message
    res.status(403).end()
  }
})

router.post("/login", async (req, res) => {
  const {phone} = req.body
  try{
    const user = await model.signIn(phone)
    if(user){
     
      client 
      .verify
          .services(serviceId)
          .verifications
          .create({
            to: phone,
            channel: 'sms'
          })
          .then((info) => {
            res.status(200).send({info, user}) 
          }).catch((err) => res.send(err.message))
    }
    else{
      res.status(401).send("Bu raqam ro'yxatdan o'tmagan")
    }
  }
  catch(err){

    console.log(err)
    res.statusMessage = err.message
    res.status(403).end()
  }
})

router.post("/login-verify", (req, res) => {
  const {phone, code} = req.body
  try{
   
    if(phone && code){
     
      client
      .verify
      .services(serviceId)
      .verificationChecks
      .create({
         to: phone,
         code: code
      })
      .then(async (info) => {

        if(info.valid == true){
          const user = await model.signIn(phone)
          const accessToken = await sign(user)      
          res.send({token: accessToken}).status(201)  
        }
     
      }).catch((err) => res.send(err.message))
    }
    else{
      res.status(401).end()
    }
  }
  catch(err){

    console.log(err)
    res.statusMessage = err.message
    res.status(403).end()
  }
})


// Get user's courses
router.get('/users/mycourses/:id', async (req, res) => {
  const {id} = req.params
  try{
      const data = await model.MyCourses(id)
      if(data){
          res.send(data)
      }
  }
  catch(err){
      console.log(err)
      res.statusMessage = err.message
      res.status(403).end()
  }
})

// To Add comment to course
router.post('/users/course/comment', async (req, res) => {
  const {user_id, course_id, content} = req.body
  try{
      const comment = await model.addComment(user_id*1, course_id*1, content)
      if(comment){
        res.send(comment)
      }
  }
  catch(err){
      console.log(err)
      res.statusMessage = err.message
      res.status(400).end()
  }
})



module.exports = router;

0336

