const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const Router = require("express").Router
const { model } = require("./models")
const {sign, verify} = require("../../../function/jwt")
const expressSession = require('express-session')


const router = Router()


// router.use(expressSession({
//   secret: 'mohirdev',
//   resave: true,
//   saveUninitialized: true
// }))


router.use(passport.initialize())
// router.use(passport.session())

router.get('/login/google', passport.authenticate('google', {scope:['profile email']}))

router.get('/google', passport.authenticate('google'), async(req, res) => {
  
  const data = req.user._json

  try {
    const user = await model.signInGoogle(data)
    console.log(user);
    if(user){
      const accessToken = await sign(user)      
      res.redirect('/', {accessToken})
    } else {
      const user = await model.signUpGoogle(data)
      if(user){
        const accessToken = await sign(user)      
        res.redirect('/', {accessToken})
      }
    }

  } catch (error) {
    console.log(error.message);
    res.statusMessage = error.message
    res.status(403).end()
  }
})




router.post("/signup", async (req, res) => {

    const data = req.body
 
    try{
     
      const checkUsername = await model.checkUsername(data)
      const checkEmail = await model.checkEmail(data)
      if(checkUsername && checkEmail){
        res.status(400).send("These are email and username already exist")
      } else if(checkEmail){
        res.status(400).send("This is email already exist")
      } else if(checkUsername){
      
        res.status(400).send("This is username already exist")
      }
                
      else{

        const user = await model.signUP(data)
        const accessToken = await sign(user)
        
        res.send(accessToken).status(201)
        
      }

          
    }
    catch(err){
      console.log(err)
      res.statusMessage = err
      res.status(401).end()
      
    }

   
})

router.post("/login", async (req, res) => {

    const data = req.body

  try{
    const user = await model.signIn(data)
    if(user){

      const accessToken = await sign(user)

        res.send(accessToken)
    }
    else{
      res.send("not user")
    }

  }
  catch(err){

    console.log(err)
    res.statusMessage = err.message
    res.status(403).end()
  }
})

module.exports = router;



