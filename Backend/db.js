// getting-started.js
import mongoose from "mongoose";


const ConnecttoMongo = async () => {
    await mongoose.connect('mongodb://localhost:27017/crime-portal');
    console.log("Database Connected Successfully")

}
// ConnecttoMongo().catch(err => console.log(err));

export default ConnecttoMongo;