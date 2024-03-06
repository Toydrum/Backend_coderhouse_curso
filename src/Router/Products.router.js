import { Router } from "express";
import ProductManager from "../Dao/controllers/productManagerDb.js";
const router = Router();

router.get("/", async (req, res) => {
	try {
			const { limit = 10, page = 1, sort, query } = req.query;
			console.log(limit, page, sort, query)
			const productos = await ProductManager.getProducts({
					limit: parseInt(limit),
					page: parseInt(page),
					sort,
					query,
			});

			res.json({
					status: 'success',
					payload: productos,
					totalPages: productos.totalPages,
					prevPage: productos.prevPage,
					nextPage: productos.nextPage,
					page: productos.page,
					hasPrevPage: productos.hasPrevPage,
					hasNextPage: productos.hasNextPage,
					prevLink: productos.hasPrevPage ? `/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
					nextLink: productos.hasNextPage ? `/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
			});

	} catch (error) {
			console.error("Error al obtener productos", error);
			res.status(500).json({
					status: 'error',
					error: "Error interno del servidor"
			});
	}
});

router.get("/:idProduct", async (req, res) => {
	const idProduct = req.params.idProduct;
	try {
		const product = await ProductManager.getProductById(idProduct);

		if (!product) {
			return res.status(400).json({ message: "product not found with the id" });
		}
		res.status(200).json({ message: "product found", product });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/", async (req, res) => {
	const nuevoProducto = req.body;
	try {
		await ProductManager.addProduct(nuevoProducto);
		res.status(200).json({ message: "product created", product: nuevoProducto });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.put("/:idProduct", async (req, res) => {
	const id = req.params.idProduct;
	const productoActualizado = req.body;

	try {
		await ProductManager.updateProduct(id, productoActualizado);
		console.log(productoActualizado);
		res.json({ message: "Producto actualizado exitosamente" });
	} catch (error) {
		console.error("error al actualizar producto", error);
		res.status(500).json({ error: "error interno del servidor" });
	}
});

router.delete("/:idProduct", async (req, res) => {
	const id = req.params.idProduct;

	try {
		await ProductManager.deleteProduct(id);
		res.json({ message: "Producto eliminado" });
	} catch (error) {
		console.error("error al eliminar producto", error);
		res.status(500).json({ error: "error interno del servidor" });
	}
});

export default router;
