import mongoose from "mongoose";

const database = mongoose.connect("mongodb+srv://CoderHouse:CoderHouse@cluster0.vbr08oz.mongodb.net/Ecommerce?retryWrites=true&w=majority")
.then(()=> console.log('conectado a la base de datos'))
.catch((error)=> console.log(error))

export default database;