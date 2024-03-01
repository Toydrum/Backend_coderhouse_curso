import mongoose from "mongoose";

const costumersSchema = new mongoose.Schema({
  _id: String,
  nombre: String,
  apellido: String,
  edad: Number
})

  const CostumersModel = mongoose.model('costumers', costumersSchema)

  export default CostumersModel