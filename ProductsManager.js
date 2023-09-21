import fs from 'fs'

const path = 'products.json'

class ProductsManager{
    async getProducts(queryObj){
        const {limit} = queryObj
        try{
            if(fs.existsSync(path)){
                const productsFile = await fs.promises.readFile(path, 'utf-8')
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

    async getProductById(id){
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
            if(!products.length){
                id = 1
            }
            else{
                id = products[products.length -1].id +1
            }
            const newProduct = {id,...obj}
            products.push(newProduct)
            await fs.promises.writeFile(path, JSON.stringify(products))
            return newProduct
        } catch (error) {
            return error
        }
    }
}

async function test(){

}

export const productsManager = new ProductsManager()