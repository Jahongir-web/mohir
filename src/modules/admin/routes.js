const Router = require("express").Router
const { model } = require("./models")
const {sign, verify} = require("../../../function/jwt")
const { v4 } = require("uuid")
const path = require("path")

const uploadsDir = path.join(__dirname, "../../static/files")

const router = Router()

// Add category
router.post("/category", async (req, res) => {

    const {category_name} = req.body

    try{       
        const photo = req.files.photo
        const imgName = v4() + '.' + photo.mimetype.split("/")[1]
        
        photo.mv(path.join(uploadsDir, imgName), (error) => {            
            if(error){
                console.log(error)
            }
        })

       const newCategory = await model.createCategory(category_name, imgName)   
       if(newCategory){
        res.send(newCategory)       
       }    
    } catch(err){
         console.log(err)
         res.statusMessage = err.message
         res.status(400).end()
    }   
})


// Delete Category
router.delete("/category/:id", async (req, res) => {
    const {id} = req.params
    try{
        const data = await model.deleteCategory(id*1)
        
        res.send(data)
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})

// Delete Comment about course
router.delete("/course/comment/:id", async (req, res) => {
    const {id} = req.params
    try{
        const data = await model.deleteCommentCourse(id*1)
        
        res.send(data)
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(400).end()
    }
})

module.exports = router;