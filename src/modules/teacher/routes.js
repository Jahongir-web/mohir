const Router = require("express").Router
const path = require("path")
const { v4 } = require("uuid")
const { model } = require("./models")
const {sign, verify} = require("../../../function/jwt")

const uploadsDir = path.join(__dirname, "../../static/files")

const router = Router()

// Add Course
router.post("/course", async (req, res) => {
    const data = req.body
    const {author_id} = req.body
        
    try{
        const photo = req.files.photo
        const imgName = v4() + '.' + photo.mimetype.split("/")[1]
        
        photo.mv(path.join(uploadsDir, imgName), (error) => {
            
            if(error){
                console.log(error)
            }
        })
        const course = await model.addCourse({data, imgName})
        
        if(course){            
            const authors = await model.addAuthor(author_id, course.course_id)
            res.send({course, authors})
        }    
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})


router.delete("/course/:id", async (req, res) => {
    const {id} = req.params
    try{
        const deleteCourse = await model.deleteCourse(id)
        
        if(deleteCourse){   
            res.send(deleteCourse)
        }        
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})



router.post("/topic", async (req, res) => {
    const {topic_name, course_id} = req.body
    try{ 
        const topic = await model.addTopic(topic_name, course_id)
        
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

router.post("/video", async (req, res) => {

    const {title, link, topic_id, info} = req.body
    
    try{
        const {material} = req.files
        const fileName = material.size + '.' + material.name

        material.mv(path.join(uploadsDir, fileName), (error) => {            
            if(error){
                console.log(error)
            }
        })

        const newVideo = await model.addVideo(title, link, topic_id, fileName, info) 
        if(newVideo){
            res.send(newVideo)
        }
    }
    catch(err){    
        try {
            const newVideo = await model.addVideo(title, link, topic_id, fileName = null, info) 
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

module.exports = router;