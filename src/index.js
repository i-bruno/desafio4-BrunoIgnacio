import express from 'express';
import ProductRouter from "./router/product.js"
import CartRouter from "./router/carts.js"
import { engine } from 'express-handlebars';
import * as path from "path";
import __dirname from "./utils.js";
import ProductManager from './controllers/ProductManager.js';
import viewRouter from './router/view.router.js';
import {Server} from 'socket.io';
import handlebars from "express-handlebars";


const app = express();
const PORT = 8080;
const product = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/cart", CartRouter);
app.use("/api/products", ProductRouter);
app.use("/", viewRouter);

//Handlebars
app.engine("handlebars", handlebars.engine());
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

const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor express en puerto ${PORT}`);
})

app.use('/', viewRouter);

const socketServer = new Server(httpServer);

const pmanagerSocket = new ProductManager(__dirname+"/models/products.json")

socketServer.on('connection', async (socket)=>{
    console.log("Nuevo cliente conectado", socket.id)

    const listadeproductos = await pmanagerSocket.getProducts({});
    socket.emit("enviodeproducts", listadeproductos)

})