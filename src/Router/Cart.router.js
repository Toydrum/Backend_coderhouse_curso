import { Router } from "express";
import cartManager from "../CartManager.js";
//import express from "express";
const router = Router();
/* Create */
router.post("/", async (req, res) => {
    res.json(await cartManager.addCart(req.body));
});
router.post("/:id/product/:pid", async (req, res) => {
  res.json(
    await cartManager.addProductToCart(req.params.cid, req.params.pid)
  );
});
/* Read */
router.get("/:id", async (req, res) => {
  res.json(await cartManager.getCartById(req.params.cid));
});
/* Update */
router.put("/:id", async (req, res) => {
  res.json(await cartManager.updateCart(req.params.cid, req.body));
});
router.put("/:id/product/:pid", async (req, res) => {
  res.json(
    await cartManager.updateProductFromCart(
      req.params.cid,
      req.params.pid,
      req.body
    )
  );
});
/* Delete */
router.delete("/:id/product/:pid", async (req, res) => {
  res.json(
    await cartManager.deleteProductFromCart(req.params.cid, req.params.pid)
  );
});
export default router;