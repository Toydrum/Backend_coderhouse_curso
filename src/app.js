import express from "express";
import productsRouter from "./Router/Products.router.js";
import cartRouter from "./Router/Cart.router.js";
//import viewsRouter from "./Router/views.router.js";
import costumersRouter from "./Router/costumers.router.js"
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import database from "./database.js"


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
//Mongodb Atlas
/* mongoose.connect("mongodb+srv://CoderHouse:CoderHouse@cluster0.vbr08oz.mongodb.net/Ecommerce?retryWrites=true&w=majority")
.then(()=> console.log('conectado a la base de datos'))
.catch((error)=> console.log(error)) */
const db = database
//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

//routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
//app.use("/", viewsRouter);
app.use("/api/costumers", costumersRouter);

const httpServer = app.listen(8080, () => {
	console.log("Escuchando al puerto 8080");
});


//Websocket
const socketServer = new Server(httpServer);






















/* const products = [];

socketServer.on("connection", (socket) => {
	console.log(`cliente conectado ${socket.id}`);
	socket.on(`disconnect`, () => {
		console.log(`cliente desconectado ${socket.id}`);
	});

	socket.on("message", (info) => {
		products.push(info);
		console.log(products);
		console.log(`product: ${info}`);
		socketServer.emit(`secondEvent`, products);
	});

	socket.on("getProducts", async (limit) => {
		try {
			let products = await fetch(
				`http://localhost:8080/api/products/${!!limit ? `?limit=${limit}` : ""}`
			);
			if (products.status !== 200) throw new Error("Petition error.");
			products = await products.json();
			console.log(products);
			if (!products?.products) throw new Error("There is no products.");
			socket.emit("productsLoaded", {
				message: products.message,
				products: products.products,
			});
		} catch (error) {
			socket.emit("errorGetProducts", {
				error: error,
				errorMessage: error.message,
				errorCause: error.cause,
			});
		}
	});
}); */
