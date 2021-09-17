const passport = require('passport')
const Router = require("express").Router
const { model } = require("./models")
const {sign, verify} = require("../../../function/jwt")
// const expressSession = require('express-session')

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
      res.json(accessToken).status(201)
    } else {
      const user = await model.signUpGoogle(data)
      if(user){
        const accessToken = await sign(user)      
        res.json(accessToken).status(201)
      }
    }

  } catch (error) {
    console.log(error.message);
    res.statusMessage = error.message
    res.status(403).end()
  }
})

router.get('/login/facebook', passport.authenticate('facebook', {scope:['email']}))

router.get('/facebook', passport.authenticate('facebook'), (req, res) => {
  // res.redirect('/')
  res.send(req.user)
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



