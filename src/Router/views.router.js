import { Router } from "express";

const router = Router()


router.get('/index', (req, res)=>{
    res.render("index");
})



export default router;