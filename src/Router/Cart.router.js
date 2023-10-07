import { Router } from "express";
import cartManager from "../CartManager.js";
//import express from "express";
const router = Router();

router.get('/:cid', async(req,res)=>{
  try {
    const cart = await cartManager.getCartById(req.params.cid)
    if(!cart.length){
      console.log(cart)
      return res.status(200).json({message: `cart found id:${cart.data.id}`})

  }}
  catch (error) {
    res.status(500).json({message: error.message})
  }
})

//post

router.post('/', async(req,res)=>{
  res.json(await cartManager.addCart(req.body));
})


router.post('/:cid/product/:pid', async(req,res)=>{
  console.log('Solicitud recibida en la ruta /:cid/product/:pid');
  res.json(
    await cartManager.addProductToCart(req.params.cid, req.params.pid)
)})

export default router;