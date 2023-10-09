import fs from "fs";

class ProductsManager {
  file = "products.json";
  constructor(path = "./") {
    this.path = path;
  }
  async getProducts(limit/*? : string */) {
    try {
      limit =
        !!limit && !Number.isNaN(parseInt(limit)) ? parseInt(limit) : 9999;
      if (fs.existsSync(this.path + this.file)) {
        const productsFile = await fs.promises.readFile(
          this.path + this.file,
          "utf-8"
        );
        let productsArray = JSON.parse(productsFile);
        productsArray = productsArray.slice(
          0,
          limit <= productsArray.length ? limit : productsArray.length
        );
        return productsArray;
      } else {
        return [];
      }
    } catch (error) {
      return error;
    }
  }

  async getProductById(idProduct) {
    try {
      const productsFile = await this.getProducts();
      const product = productsFile.find((p) => p.id === idProduct);
      return product;
    } catch (error) {
      return error;
    }
  }

  async createProduct(obj) {
    try {
      const products = await this.getProducts();
      let id;
      if (!products.length) {
        id = 1;
      } else {
        id = products[products.length - 1].id + 1;
      }
      const newProduct = { id, ...obj };
      console.log("Nuevo producto creado:", newProduct);
      products.push(newProduct);
      fs.writeFileSync(this.path + this.file, JSON.stringify(products));
      if (!newProduct) throw new Error("no hay nuevo producto");
      return newProduct;
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const newArrayProducts = products.filter((p) => p.id !== id);
      await fs.promises.writeFile(this.path, JSON.stringify(newArrayProducts));
    } catch (error) {
      return error;
    }
  }
}

export const productsManager = new ProductsManager("./data/");
