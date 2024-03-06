import ProductModel from "../models/products.model.js";

class ProductManager {
	static  async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
		try {

				if (!title || !description || !price || !code || !stock || !category) {
						console.log("Todos los campos son obligatorios");
						return;
				}

				const existeProducto = await ProductModel.findOne({ code: code });

				if (existeProducto) {
						console.log("El código debe ser único");
						return;
				}

				const newProduct = new ProductModel({
						title,
						description,
						price,
						img,
						code,
						stock,
						category,
						status: true,
						thumbnails: thumbnails || []
				});

				await newProduct.save();

		} catch (error) {
				console.log("Error al agregar producto", error);
				throw error;
		}
}

	static async getProducts({ limit = 10, page = 1, sort, query } = {}) {
		try {
				const skip = (page - 1) * limit;

				let queryOptions = {};

				if (!!query&& query != "undefined") {
						queryOptions = { category: query };
				}

				const sortOptions = {};
				if (sort) {
						if (sort === 'asc' || sort === 'desc') {
								sortOptions.price = sort === 'asc' ? 1 : -1;
						}
				}

				const productos = await ProductModel
						.find(queryOptions)
						.sort(sortOptions)
						.skip(skip)
						.limit(limit);

				const totalProducts = await ProductModel.countDocuments(queryOptions);

				const totalPages = Math.ceil(totalProducts / limit);
				const hasPrevPage = page > 1;
				const hasNextPage = page < totalPages;

				return {
						docs: productos,
						totalPages,
						prevPage: hasPrevPage ? page - 1 : null,
						nextPage: hasNextPage ? page + 1 : null,
						page,
						hasPrevPage,
						hasNextPage,
						prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
						nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
				};
		} catch (error) {
				console.log("Error al obtener los productos", error);
				throw error;
		}
}

	static async getProductById(id) {
		try {
			const producto = await ProductModel.findById(id);
			if (!producto) {
				console.log("producto no encontrado");
				return null;
			}

			console.log("Producto encontrado");
			return producto;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	static async updateProduct(id, productoActualizado) {
		try {
			const updatedProduct = await ProductModel.findByIdAndUpdate(
				id,
				productoActualizado
			);

			if (!updatedProduct) {
				console.log("producto no encontrado");
				return null;
			}

			console.log("producto actualizado");
			return updatedProduct;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	static async deleteProduct(id) {
		try {
			const deleteProduct = await ProductModel.findByIdAndDelete(id);

			if (!deleteProduct) {
				console.log("producto no encontrado");
				return null;
			}

			console.log("producto borrado");
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}

export default ProductManager;
