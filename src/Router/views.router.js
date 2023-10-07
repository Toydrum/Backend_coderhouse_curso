import { Router } from "express";

const router = Router()


router.get('/index', (req, res)=>{
    res.render("index");
})

router.get('/realTimeProducts', (req, res)=>{
    res.render("realTimeProducts");
})

export default router;