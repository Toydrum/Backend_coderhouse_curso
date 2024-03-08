import { Router } from "express";
import passport from "passport";

const router = Router();



router.post("/", passport.authenticate("register", {failureRedirect: "/failedregister"}), async (req, res) => {
  if(!req.user) return res.status(400).send({status:"error"});

  req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email:req.user.email
  };

  req.session.login = true;

  res.redirect("/products");
})

router.get("/failedregister", (req, res) => {
  res.send({error: "Registro fallido!"});
})

export default router;