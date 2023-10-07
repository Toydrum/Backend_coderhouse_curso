import fs from 'fs'


class ProductsManager{
    file = 'products.json'
    constructor(path = './') {
        this.path = path;
      }
      
    async getProducts(queryObj){
        if (typeof queryObj !== 'undefined' && queryObj.limit){
        try{
            if(fs.existsSync(this.path + this.file)){
                const productsFile = await fs.promises.readFile(this.path + this.file, 'utf-8')
                const productsArray = JSON.parse(productsFile)
                return limit ? productsArray.slice(0,limit) : productsArray
            }
            else{
                return [];
            }
        }
        catch(error){
            return error
        }
    }
    }

    async getProductById(idProduct){
        try {
            const productsFile = await this.getProducts({})
            const product = productsFile.find((p)=> p.id === id)
            return product
        } catch (error) {
            return error
        }
    }

    async createProduct(obj){
        try {
            const products = await this.getProducts({})
            let id
            console.log(products)
            if(!products.length){
                id = 1
            }
            else{
                id = products[products.length -1].id +1
            }
            const newProduct = {id,...obj}
            console.log('Nuevo producto creado:', newProduct);
            products.push(newProduct)
            fs.writeFileSync(this.path + this.file, JSON.stringify(products))
            if(!newProduct) throw new Error('no hay nuevo producto')
            return newProduct
        } catch (error) {
            return error
        }
    }

    async deleteProduct(id){
        try {
            const products = await this.getProducts()
            const newArrayProducts = products.filter(p=>p.id!==id)
            await fs.promises.writeFile(this.path,JSON.stringify(newArrayProducts))
        } catch (error) {
            return error
        }
    }
}



export const productsManager = new ProductsManager('./data/')