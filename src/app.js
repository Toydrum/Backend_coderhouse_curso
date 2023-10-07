import express from 'express';
import productsRouter from './Router/Products.router.js'; 
import cartRouter from './Router/Cart.router.js';
import viewsRouter from './Router/views.router.js';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'))

//handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", __dirname + "/views")


//routes
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter)
app.use('/api', viewsRouter)



const httpServer = app.listen(8080,()=>{
    console.log('Escuchando al puerto 8080')
});

//Websocket
const socketServer = new Server(httpServer);


const products = [];
    
socketServer.on('connection',(socket)=>{
    console.log(`cliente conectado ${socket.id}`);
    socket.on(`disconnect`,()=>{
        console.log(`cliente desconectado ${socket.id}`)
    });

    socket.on('message',(info)=>{
        products.push(info);
        console.log(products);
        console.log(`product: ${info}`);
        socketServer.emit(`secondEvent`, products);
    })






})

