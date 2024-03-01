import { Router } from "express";
import { productsManager } from "../ProductsManager.js";
const router = Router();

router.get("/", async (req, res) => {
	try {
		const products = await productsManager.getProducts(req.query.limit);
		if (!products.length) {
			return res.status(200).json({ message: "no products" });
		}
		res.status(200).json({ message: "products found", products });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get("/:idProduct", async (req, res) => {
	const idProduct = req.params.idProduct;
	try {
		const product = await productsManager.getProductById(+idProduct);

		if (!product) {
			return res.status(400).json({ message: "product not found with the id" });
		}
		res.status(200).json({ message: "product found", product });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.post("/", async (req, res) => {
	const { product, status } = req.body;
	if (!product || !status) {
		return res.status(400).json({ message: "some data missing" });
	}
	try {
		const newProduct = await productsManager.createProduct(req.body);
		if (!newProduct) throw new Error("no hay nuevo producto");
		res.status(200).json({ message: "product created", product: newProduct });
	} catch (error) {
		res.status(500).json({ message: error });
	}
});

router.put("/:idProduct", async (req, res) => {
	res.json(await productsManager.getProductById(req.params.id, req.body));
});
export default router;
