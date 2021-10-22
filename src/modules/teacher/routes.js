const Router = require("express").Router
const path = require("path")
const { v4 } = require("uuid")
const { model } = require("./models")
const {sign, verify} = require("../../../function/jwt")
const axios = require('axios');

const uploadsDir = path.join(__dirname, "../../static/files")

const router = Router()

// Add Course
router.post("/course", async (req, res) => {
    const {title, info, level, tags, category_id, price, author_id} = req.body
        
    try{
        // const photo = req.files.photo
        // const imgName = v4() + '.' + photo.mimetype.split("/")[1]
        const imgName = 'hello world!'
        
        // photo.mv(path.join(uploadsDir, imgName), (error) => {
            
        //     if(error){
        //         console.log(error)
        //     }
        // })
        const course = await model.addCourse(title, info, level, tags, category_id*1, price, author_id*1, imgName)
        
        if(course){            
            const authors = await model.addAuthor(author_id*1, course.course_id)
            res.send({course, authors})
        }    
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})


// Add Author 
router.post("/course/author", async (req, res) => {
    const {user_id, course_id} = req.body
        
    try{
        const author = await model.addAuthor(user_id*1, course_id*1)
        res.send(author)  
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})

// Update Course

router.put("/course", async (req, res) => {
    const {course_id, intro_link, duration, course_profit, course_requirement, for_who} = req.body
        
    try{
        const course = await model.updateCourse(course_id*1, intro_link, duration, course_profit, course_requirement, for_who)
        res.send(course)
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})

// Publish course
router.put("/course/publish/:id", async (req, res) => {
    const {id} = req.params
    try{
        const publishCourse = model.publishCourse(id*1) 
        res.status(201).end()     
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})


// Delete course
router.delete("/course/:id", async (req, res) => {
    const {id} = req.params
    try{
        const deleteAuthor = await model.deleteAuthor(id*1)
        const deleteCourse = await model.deleteCourse(id*1)
        
        if(deleteCourse){   
            res.send(deleteCourse)
        } else{
            res.status(400)
        }        
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})


// Add topic
router.post("/topic", async (req, res) => {
    const {topic_name, course_id} = req.body
    try{ 
        const topic = await model.addTopic(topic_name, course_id*1)
        
        if(topic){    
            res.send(topic)
        }
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})

// Delete topic
router.delete("/topic/:id", async (req, res) => {
    const {id} = req.params
    try{ 
        const topic = await model.deleteTopic(id*1)
        
        if(topic){    
            res.send(topic)
        }
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})

// Add video
router.post("/video", async (req, res) => {
    const {title, link, topic_id, info} = req.body   

    let duration 
    const index = 31
    const lastIndex = link.indexOf('?')
    const videoId = link.slice(index, lastIndex)
    
    await axios({
        method: 'get',
        url: `https://v1.nocodeapi.com/jahongir/vimeo/JDaEcFUHvXDTjEox/videoInfo?video_id=${videoId}`, 
        params: {},
    }).then(function (response) {
        const length = response.data.duration
        const minute = Math.floor(length / 60)
        const second = length % 60
        duration = `${minute}:${second}`
        return duration
    }).catch(function (error) {
        console.log(error);
    })

    try{
        const {material} = req.files
        const fileName = material.size + '.' + material.name

        material.mv(path.join(uploadsDir, fileName), (error) => {            
            if(error){
                console.log(error)
            }
        })

        const newVideo = await model.addVideo(title, link, topic_id*1, fileName, info, duration) 
        if(newVideo){
            res.send(newVideo)
        }
    }
    catch(err){    
        try {
            const newVideo = await model.addVideo(title, link, topic_id*1, fileName = null, info, duration) 
            if(newVideo){
                res.send(newVideo)            
            }else{
                res.status(400).end()
            }
        } catch (err) {
            console.error(err.message);
            res.statusMessage = err.message
            res.status(400).end()
        } 
    }
})


// Add quiz to course
router.post("/quiz", async (req, res) => {
    const {video_id, title, info, quiz_id, question_text, type, answers} = req.body
    try{ 
        if(quiz_id) {
            const question = await model.addQuestion(quiz_id*1, question_text, type)
            const {question_id} = question
            await answers.forEach(async(item) => {
                const answer = await model.addAnswer(question_id, item.answer, item.is_correct)
            })
            res.status(201).end()

        } else {
            const quiz = await model.addQuiz(video_id*1, title, info)
            const {quiz_id} = quiz
            const question = await model.addQuestion(quiz_id*1, question_text, type)
            const {question_id} = question
            await answers.forEach(async(item) => {
                const answer = await model.addAnswer(question_id, item.answer, item.is_correct)
            })           
            res.status(201).end()

        }
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})


// Delete quiz
router.delete("/quiz/:id", async (req, res) => {
    const {id} = req.params
    try{
        const answers = await model.deleteAnswers(id*1)
        const question = await model.deleteQuestion(id*1)
        const quiz = await model.deleteQuiz(id*1)
        if(quiz){    
            res.send(quiz)
        }else{
            res.status(400).end()
        }
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})


// Delete video
router.delete("/video/:id", async (req, res) => {
    const {id} = req.params
    try{ 
        const video = await model.deleteVideo(id*1)
        
        if(video){    
            res.send(video)
        }else{
            res.status(400)
        }
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})


//  Add blog
router.post('/blog', async (req, res) => {

    const {title, content, user_id, categoryId} = req.body
    try {
      const photo = req.files.photo
      const imgName = v4() + '.' + photo.mimetype.split("/")[1]
  
      photo.mv(path.join(uploadsDir, imgName), (error) => {
              
        if(error){
          console.log(error)
        }
      })
  
      const blog = await model.addBlog(title, content, imgName, user_id*1)
      
      await categoryId.forEach(async(item) => {
        const category = await model.addBlogCategory(item, blog.blog_id)
      })
      res.status(201).send(blog)
  
    } catch (error) {
      console.error(error.message);
      res.status(400)
    }
})

// Delete blog
router.delete("/blog/:id", async (req, res) => {
    const {id} = req.params
    try{ 

        const delete_blog_category = await model.deleteBlogCategory(id*1)
        const delete_blog = await model.deleteBlog(id*1)
        
        if(delete_blog){    
            res.status(201).send(delete_blog)
        }else{
            res.status(400)
        }
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})



module.exports = router;