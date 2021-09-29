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

// Get course item
router.get('/course/:id', async (req, res) => {
    const {id} = req.params
    try{
        const course = await model.courseItem(id*1)

        const authors_id = await model.courseAuthorsId(id*1)
        let authors = []
        await authors_id.forEach(async(item) => {
            const teacher = await model.getTeacher(item.user_id)
            authors.push(teacher)
        })
        const topics = await model.courseTopics(id*1)
        const videos = await model.courseVideos(id*1)
        const comments = await model.courseComments(id*1)
        const similar_courses = await model.coursesByCategoryId(course.category_id)
        if(course){
            res.send({course, topics, videos, authors, comments, similar_courses})
        }
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(403).end()
    }
})


//  Teacher Page
router.get("/teacher-page/:id", async (req, res) => {
    try {
        const {id} = req.params

        const teacher = await model.getTeacher(id*1)
        const teacherCourses = await model.getTeacherCourses(id*1)

      if(teacher){
        res.send({teacher, teacherCourses})
      }else{
        res.send({mes: "this user does not exist"})
      }            
    } catch (err) {
        console.log(err);
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


// GET BLOGS
router.get('/blogs', async (req, res) => {    
    try{
        const blogs = await model.allBlogs()
        if(blogs){
            let categories = await model.getCategoryBlogs()        
            res.send({blogs, categories})
        } else {
            res.status(400).end()
        }        
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})

// GET blogById
router.get('/blog/:id', async (req, res) => { 
    const id = req.params.id * 1   
    try{
        const blog = await model.blog(id)
        let categories = await model.categoryBlog(id)        
        if(blog){
            res.send({blog, categories})
        } else {
            res.status(400).end()
        }        
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})


// GET TEACHERS 
router.get('/teachers', async (req, res) => {    
    try{
        const teachers = await model.allTeachers()
        if(teachers){
            let count_courses = await model.countCourses()        
            res.send({teachers, count_courses})
        } else {
            res.status(400).end()
        }        
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})

module.exports = router;



