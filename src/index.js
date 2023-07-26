import express from 'express';
import ProductRouter from "./router/product.js"
import CartRouter from "./router/carts.js"

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/cart", CartRouter);
app.use("/api/products", ProductRouter);



app.listen(PORT, ()=>{
    console.log(`Servidor express en puerto ${PORT}`);
})