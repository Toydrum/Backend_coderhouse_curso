//import { Express } from "express";
import { Router } from "express";
import  CostumersModel  from "../Dao/models/costumers.model.js";

const router = Router();

  router.get("/", async (req, res) => {
  try {
    const clientes = await CostumersModel.find();
    console.log(clientes)
    await res.json(clientes)
  } catch (error) {
    res.status(500).json({message: "no costumers"})
  }
})

export default router