import { Router } from "express";

import passport from "passport";


const router = Router();

router.post(
	"/login",
	passport.authenticate("login", {
		failureRedirect: "/api/sessions/faillogin",
	}),
	async (req, res) => {
		try {
			if (!req.user) return res.status(400).send({ status: "error" });
			req.session.user = {
				first_name: req.user.first_name,
				last_name: req.user.last_name,
				age: req.user.age,
				email: req.user.email,
			};
	
			req.session.login = true;
	
			res.redirect("/products");
			
		} catch (error) {
			console.log(error)
		}
	}
);

router.get("/faillogin", async (req, res) => {
	res.send({ error: "Fallo login" });
});

router.get("/logout", (req, res) => {
	if (req.session.login) {
		req.session.destroy();
	}
	res.redirect("/login");
});

export default router;
