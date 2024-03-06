import { Router } from "express";
import CartManager from "../Dao/controllers/cartManagerdb.js";
import CartModel from "../Dao/models/cart.model.js";

const router = Router();


router.get("/:cid", async (req, res) =>{
  const cartId = req.params.cid;

  try {
      const carrito = await CartModel.findById(cartId)
          
      if (!carrito) {
          console.log("No cart with that id");
          return res.status(404).json({ error: "Cart not found" });
      }

      return res.json(carrito.products);
  } catch (error) {
      console.error("Error finding cart", error);
      res.status(500).json({ error: "Error from server" });
  }
});

router.post("/", async (req, res) => {
  try {
      const nuevoCarrito = await CartManager.createCart();
      res.json(nuevoCarrito);
  } catch (error) {
      console.error("Error creating cart", error);
      res.status(500).json({ error: "Error from server" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
      const actualizarCarrito = await CartManager.addProductToCart(cartId, productId, quantity);
      res.json(actualizarCarrito.products);
  } catch (error) {
      console.error("Error adding product to cart", error);
      res.status(500).json({ error: "Error from server" });
  }
});

router.put("/:cid", async (req, res)=>{
  const cartId = req.params.cid;
  const updatedProducts = req.body;


  try {
      const updatedCart = await CartManager.updateProductsFromCart(cartId, updatedProducts);
      res.json(updatedCart);
  } catch (error) {
      console.error('Error updating cart', error);
      res.status(500).json({
          status: 'error',
          error: 'Error from server',
      });
  }
});

router.put("/:cid/products/:pid", async (req, res)=>{
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const updatedCart = await CartManager.updateProductAmountInCart(cartId, productId, newQuantity);

    res.json({
        status: 'success',
        message: 'amount updated succesfully',
        updatedCart,
    });
} catch (error) {
    console.error('Error updating amount', error);
    res.status(500).json({
        status: 'error',
        error: 'Error from server',
    });
}
});

router.delete("/:cid", async (req, res)=>{
  try {
    const cartId = req.params.cid;
    
    const updatedCart = await CartManager.deleteCart(cartId);

    res.json({
        status: 'success',
        message: 'products eliminated',
        updatedCart,
    });
} catch (error) {
    console.error('Error deleting cart', error);
    res.status(500).json({
        status: 'error',
        error: 'Error from server',
    });
}
});

router.delete("/:cid/products/:pid", async (req, res)=>{
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const updatedCart = await CartManager.deleteProductFromCart(cartId, productId);

    res.json({
        status: 'success',
        message: 'Product eliminated',
        updatedCart,
    });
} catch (error) {
    console.error('Error trying to eliminate', error);
    res.status(500).json({
        status: 'error',
        error: 'Error from server',
    });
}
});


export default router




































/* import cartManager from "../CartManager.js";
const router = Router();

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart.length) {
      return res.status(200).json({
        message: `cart found id:${cart.data.id}`,
        data: cart
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//post

router.post("/", async (req, res) => {
  res.json(await cartManager.addCart(req.body));
});

router.post("/:cid/:pid", async (req, res) => {
  res.json(await cartManager.addProductToCart(req.params.cid, req.params.pid));
}); */


