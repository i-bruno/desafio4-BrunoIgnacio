import express from 'express';
import ProductRouter from "./router/product.js"
import CartRouter from "./router/carts.js"
import { engine } from 'express-handlebars';
import * as path from "path";
import __dirname from "./utils.js";
import ProductManager from './controllers/ProductManager.js';

const app = express();
const PORT = 8080;
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/cart", CartRouter);
app.use("/api/products", ProductRouter);

//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

//static

app.use("/", express.static(__dirname + "/public"))

app.get("/", async (req, res)=>{
    let allProducts = await product.getProducts();
    res.render("home", {
        title: "Handlebars",
        producto : allProducts
    })
})

app.get("/:id", async (req, res)=>{
    let prod = await product.getProductsById(req.params.id);
    res.render("prod", {
        title: "Handlebars",
        producto : prod
    })
})

app.listen(PORT, ()=>{
    console.log(`Servidor express en puerto ${PORT}`);
})