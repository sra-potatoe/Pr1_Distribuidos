import mongoose from "mongoose";

const uri = "mongodb+srv://erickahinojosa787_db_user:TU_PASSWORD_REAL@cluster0.pgdl93i.mongodb.net/electoral_rrv?retryWrites=true&w=majority";

console.log("1. INICIANDO CONEXIÓN A MONGO...");

async function test() {
  try {
    console.log("2. CONECTANDO...");

    await mongoose.connect(uri);

    console.log("3. MONGO CONECTADO OK");

    await mongoose.connection.close();

    console.log("4. CONEXIÓN CERRADA");
  } catch (err) {
    console.log("❌ ERROR MONGO:");
    console.log(err.message);
  }
}

test();