const express = require("express");
const router = express.Router();
const {searchJobs}=require('../controllers/jobController')

router.get("/search", searchJobs);

module.exports=router