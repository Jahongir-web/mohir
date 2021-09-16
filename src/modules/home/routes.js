const Router = require("express").Router
const { model } = require("./models")
const {sign, verify} = require("../../../function/jwt")
const moment = require('moment')
require("moment/locale/uz-latn")

const router = Router()

router.get("/", async (req, res) => {
    const {token} = req.headers    
    try{
        if(token){
            const user = await verify(token)            
            res.send(user)
        }    else{
            res.send("nobody")
        } 
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(403).end()
    }
})

router.get("/categories", async (req, res) => {
    try{
        const data = await model.categories()
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

router.get('/courses', async (req, res) => {
    try{
        const data = await model.courses()
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


router.get('/free/courses', async (req, res) => {
    try{
        const data = await model.freeCourses()
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

router.get('/mycourses/:id', async (req, res) => {
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

router.get('/free/courses/category/:id', async (req, res) => {
    const { id } = req.params
    try{
        const data = await model.freeCoursesByCategory(id)
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

router.get('/course/search?:title', async (req, res) => {
    const {title} = req.query    
    try{
        const data = await model.searchCourses(title)
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


router.get('/courses/category/:id', async (req, res) => {
    const {id} = req.params
    console.log(id);
    try{
        const data = await model.coursesByCategoryId(id)
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

// FILTER COURSES

router.get('/filter/courses?:id?:level?:price', async (req, res) => {
    const {id, level, price} = req.query
    try{
        const data = await model.filterCourses(id, level, price)
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


module.exports = router;



