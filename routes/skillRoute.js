const express= require('express')
const router= express.Router()
const{CreateSkills,DeleteSkills}=require('../controllers/skillController')
const authMiddleware =require("../middleware/authMiddleware");


router.post("/", authMiddleware,CreateSkills);
router.delete("/:id",authMiddleware, DeleteSkills);

module.exports=router