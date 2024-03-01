import mongoose from "mongoose";

const URI = "mongodb+srv://Rhynigath:Narygath,1747@cluster0.izuy1rb.mongodb.net/ecommerce?retryWrites=true&w=majority"
mongoose.connect(URI)
.then(()=>console.log("conectado a la base de datos"))
.catch((error)=>console.log(error))