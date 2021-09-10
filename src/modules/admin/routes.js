const Router = require("express").Router
const { model } = require("./models")
const {sign, verify} = require("../../../function/jwt")


const router = Router()

router.post("/category", async (req, res) => {
    const data = req.body
    try{       
       const newCategory = await model.createCategory(data)   
       if(newCategory){
        res.send(newCategory)       
       }    
    } catch(err){
         console.log(err)
         res.statusMessage = err.message
         res.status(403).end()
    }
   
})

router.delete("/category/:id", async (req, res) => {
    const {id} = req.params
    try{
        const data = await model.deleteCategory(id)
        res.send(data)
    }
    catch(err){
        console.log(err)
        res.statusMessage = err.message
        res.status(403).end()
    }
})

module.exports = router;