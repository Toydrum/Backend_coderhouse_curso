import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";
//Routers
import productsRouter from "./Router/Products.router.js";
import cartRouter from "./Router/Cart.router.js";
import viewsRouter from "./Router/views.router.js";
import costumersRouter from "./Router/costumers.router.js";
import sessionsRouter from "./Router/sessions.router.js";
import userRouter from "./Router/user.router.js";

import { __dirname } from "./utils/utils.js";
import { Server } from "socket.io";
import database from "./database.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static( "src/public"));
app.use(
	session({
		secret: "secretCoder",
		resave: true,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl:
				"mongodb+srv://CoderHouse:CoderHouse@cluster0.vbr08oz.mongodb.net/Ecommerce?retryWrites=true&w=majority",
			ttl: 100,
		}),
	})
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//routes
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);
app.use("/api/costumers", costumersRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", userRouter);




const httpServer = app.listen(8080, () => {
	console.log("Escuchando al puerto 8080");
});

//Websocket
const io = new Server(httpServer);
io.on("connection", (socket) => {
	console.info("cliente conectado");
	socket.on("disconnect", () => {
		console.info("cliente desconectado");
	});
	socket.on("message", (data) => {
		console.log(data);
		io.sockets.emit("message", data);
	});
	socket.emit("message", "Bienvenido al chat");
	socket.broadcast.emit(
		"evento_para_todos_menos_el_socket_actual",
		"Un usuario se ha conectado"
	);
	io.emit("evento_para_todos", "Bienvenido al chat");
	/* Products */
	socket.on("get-products", async (option) => {
		try {
			let products = {
				status: "error",
				message:
					"No se encontraron productos, por que no se dió una opción válida.",
			};

			switch (true) {
				case option === "all":
					let productsFromServer = await fetch(
						/*config.origin*/ "http://localhost:8080" + "/api/products/"
					);

					if (productsFromServer.status === 200) {
						products = await productsFromServer.json();
					} else {
						console.log(productsFromServer);
						throw new Error("No se pudo obtener los productos.");
					}
					break;
				case option.includes("filter:"):
					let productsFromServerFiltered = await fetch(
						/*config.origin*/ "http://localhost:8080" +
							"/api/products/" +
							option.replace("filter:", "")
					);
					if (productsFromServerFiltered.status === 200) {
						products = await productsFromServerFiltered.json();
					} else {
						console.log(productsFromServerFiltered);
						throw new Error("No se pudo obtener los productos.");
					}
					break;
				default:
					break;
			}
			io.sockets.emit("send-products", products);
		} catch (error) {
			io.sockets.emit("error", {
				status: "error",
				message:
					"hubo un error en el servidor al intentar obtener los productos.",
				error,
			});
		}
	});
	/* Chat */
	socket.on("user-join", (data) => {
		socket.broadcast.emit("send-message", {
			data: {
				date: data.date,
				message: data.user + " ha entrado al chat.",
				user: "System",
			},
			message: "Message added successfully",
			status: "success",
		});
	});
	socket.on("new-message", async (data) => {
		try {
			let message = {
				status: "error",
				message: "No se pudo enviar el mensaje.",
			};
			let messageFromServer = await fetch(
				/*config.origin*/ "http://localhost:8080" + "/api/messages/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			if (messageFromServer.status === 200) {
				message = await messageFromServer.json();
			} else {
				console.log(messageFromServer);
				throw new Error("No se pudo enviar el mensaje.");
			}
			io.sockets.emit("send-message", message);
		} catch (error) {
			io.sockets.emit("error", {
				status: "error",
				message: "hubo un error en el servidor al intentar enviar el mensaje.",
				error,
			});
		}
	});
	socket.on("get-messages", async (limit) => {
		try {
			let messages = {
				status: "error",
				message: "No se encontraron mensajes.",
			};
			let messagesFromServer = await fetch(
				`${
					/*config.origin*/ "http://localhost:8080"
				}/api/messages/?limit=${limit}`
			);
			if (messagesFromServer.status === 200) {
				messages = await messagesFromServer.json();
			} else {
				console.log(messagesFromServer);
				throw new Error("No se pudo obtener los mensajes.");
			}
			io.sockets.emit("send-messages", messages);
		} catch (error) {
			io.sockets.emit("error", {
				status: "error",
				message:
					"hubo un error en el servidor al intentar obtener los mensajes.",
				error,
			});
		}
	});
	socket.on("error", (error) => {
		console.error(error);
	});
	socket.on("disconnect", () => {
		console.info("cliente desconectado");
	});
});

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
				`http://http://localhost:8080/api/products/${!!limit ? `?limit=${limit}` : ""}`
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
