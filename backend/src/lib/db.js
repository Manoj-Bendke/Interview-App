import mongoose from 'mongoose';
import {ENV} from "./env.js"
export async function dbConnect(){
try{
  if(!ENV.DB_URL){
    throw new Error("DB_URL not defined")
  }
const connect = await mongoose.connect(ENV.DB_URL);
console.log("DB connected Successfully", connect.connection.host);

}catch(e){
  console.error(e);
  process.exit(1);
}
}