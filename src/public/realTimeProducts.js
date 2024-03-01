const socketClient = io();

const form = document.getElementById("form");
const inputProduct = document.getElementById("product");
const productsDiv = document.getElementById("products");
form.onsubmit = (e) => {
	e.preventDefault();
	const productName = inputProduct.value;
	socketClient.emit("message", productName);
};

socketClient.on(`secondEvent`, (info) => {
	console.log(`info sent:${info}`);
});
let limit = 9999;
socketClient.emit("getProducts", limit);
socketClient.on("errorGetProducts", (error) => {
	console.error(error);
});
socketClient.on("productsLoaded", (products) => {
	try {
		console.log(products);
		if (!products?.products) throw new Error("There is no products");
		productsDiv.innerHTML = products.products
			.map((p) => {
				return `<div class="card">
                <h3>${p.product}</h3>
                <p>Id: ${p.id}</p>
                <p>Description:${p.description}</p>
                <p>Code: ${p.code}</p>
                <p>Price: ${p.price}</p>
                <p>Status: ${p.status}</p>
                <p>Stock: ${p.stock}</p>
                <p>Category: ${p.category}</p>
            </div>`;/* ${Object.keys(p).map((k, i) => {
              let parsed = `${k}:${p[k]}`;
              return i === 0
                ? ""
                : i === 1
                ? `<h3>${parsed}</h3>`
                : `<p>${parsed}</p>`;})} */})
			.toString()
			.replace(/,/g, "");
	} catch (error) {
		productsDiv.innerHTML = `
        <h3>Error loading products!!!</h3>
        <p>${error.message}</p>
      `;
		console.error(error);
	}
});
