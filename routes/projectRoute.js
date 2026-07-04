const express= require('express')
const router= express.Router()
const authMiddleware =require("../middleware/authMiddleware");

const{CreateProject,DeleteProject}=require('../controllers/projectcontroller')

router.post("/",authMiddleware, CreateProject);
router.delete("/:id",authMiddleware, DeleteProject);

module.exports=router