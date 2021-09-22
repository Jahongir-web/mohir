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

//  Get All Categories
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


// Get All Courses
router.get('/courses', async (req, res) => {
    try{
        const data = await model.AllCourses()
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

// Get course item chala
router.get('/course/:id', async (req, res) => {
    const {id} = req.params
    try{
        const course = await model.courseItem(id*1)

        const authors = await model.courseAuthors(id*1)
        if(course){
            res.send({course, authors})
        }
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(403).end()
    }
})

// Get Free courses
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


// Get free courses by categoryId
router.get('/free/courses/category/:id', async (req, res) => {
    const { id } = req.params
    try{
        const data = await model.freeCoursesByCategory(id*1)
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

// Search course by name
router.get('/search/course?:title', async (req, res) => {
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
        res.status(400).end()
    }
})

// Get courses by categoryId
router.get('/courses/category/:id', async (req, res) => {
    const {id} = req.params
    console.log(id);
    try{
        const data = await model.coursesByCategoryId(id*1)
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



