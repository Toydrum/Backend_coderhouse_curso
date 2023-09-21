import express from 'express';
import { productsManager } from './ProductsManager.js';

const app = express()

app.get('/api/products', async(req,res)=>{
    try {
        const products = await productsManager.getProducts(req.query)
        if(!products.length){
            return res.status(200).json({message: "no products"})
        }
        res.status(200).json({message: "products found", products})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/api/products/:idProduct', async(req,res)=>{
    const {idProduct} = req.params
    try {
        const product = await productsManager.getProductById(+idProduct)
        if(!product){
            return res.status(400).json({message: 'product not found with the id'})
        }
        res.status(200).json({message: "product found", product})
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
})






app.listen(8080,()=>{
    console.log('Escuchando al puerto 8080')
})