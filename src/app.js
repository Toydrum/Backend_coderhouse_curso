import express from 'express';
import productsRouter from './Router/Products.router.js'; 
import cartRouter from './Router/Cart.router.js';
import { __dirname } from './utils.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'))

//routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter)


app.listen(8080,()=>{
    console.log('Escuchando al puerto 8080')
})

