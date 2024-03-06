import CartModel from "../models/cart.model.js";

class CartManager {
	static async createCart() {
		try {
			const nuevoCarrito = new CartModel({ products: [] });
			await nuevoCarrito.save();
			return nuevoCarrito;
		} catch (error) {
			console.log("Error creating cart");
		}
	}

  static async addProductToCart(cartId, productId, quantity = 1) {
    try {
        const carrito = await this.getCarritoById(cartId);
        const existeProducto = carrito.products.find(item => item.product.toString() === productId);

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productId, quantity });
        }

        //Vamos a marcar la propiedad "products" como modificada antes de guardar: 
        carrito.markModified("products");

        await carrito.save();
        return carrito;

    } catch (error) {
        console.log("error al agregar un producto", error);
    }
}

	static async getCarts() {

  }

	static async getCartById(cid) {
    try {
      const carrito = await CartModel.findById(cid);
      if (!carrito) {
          console.log("No cart with that id");
          return null;
      }

      return carrito;
  } catch (error) {
      console.log("Error finding cart", error);
  }
  }

	static async updateProductsFromCart(cid, updatedProducts) {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
          throw new Error('Cart not found');
      }

      cart.products = updatedProducts;

      cart.markModified('products');

      await cart.save();

      return cart;
  } catch (error) {
      console.error('Error updating cart', error);
      throw error;
  }
  }

	static async updateProductAmountInCart(cid, pid, newQuantity) {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
          throw new Error('not found');
      }

      const productIndex = cart.products.findIndex(item => item.product._id.toString() === pid);

      if (productIndex !== -1) {
          cart.products[productIndex].quantity = newQuantity;


          cart.markModified('products');

          await cart.save();
          return cart;
      } else {
          throw new Error('Product not found in cart');
      }
  } catch (error) {
      console.error('Error updating product in cart', error);
      throw error;
  }
  }

	static async deleteCart(cid) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
          cid,
          { products: [] },
          { new: true }
      );

      if (!cart) {
          throw new Error('Cart not found');
      }

      return cart;
  } catch (error) {
      console.error('Error deleting cart', error);
      throw error;
  }
}
  
	static async deleteProductFromCart(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
          throw new Error('Cart not found');
      }

     
      cart.products = cart.products.filter(item => item.product._id.toString() !== pid);

      await cart.save();
      return cart;
  } catch (error) {
      console.error('Error deleting cart', error);
      throw error;
  }
  }
}

export default CartManager