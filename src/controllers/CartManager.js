import {promises as fs} from 'fs';
import {nanoid} from 'nanoid';
import ProductManager from "./ProductManager.js"
import { createBrotliCompress } from 'zlib';

const productAll = new ProductManager;

class CartManager {
    constructor() {
        this.path = "./src/models/carts.json"
    }

    exist = async (id) =>{
        let carts = await this.readCarts();
        return carts.find(prod => prod.id === id);
    }

    readCarts = async () =>{
        let carts = await fs.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    }

    writeCarts = async (cart)=>{
        await fs.writeFile(this.path, JSON.stringify(cart));
    }

    addCart = async () =>{
        let cartsOld = await this.readCarts();
        let id = nanoid();
        let cartsConcat = [{id : id, carts : []}, ...cartsOld]
        await this.writeCarts(cartsConcat);
        return "Se agregó el carrito"
    }

    getCartsById = async (id)=>{
        let cartsById = await this.exist(id);
        if(!cartsById) return "Carrito no encontrado"
        return cartsById;
    }

    addProductInCart = async (cartId, productId) => {
        let cartsById = await this.exist(cartId);
        if(!cartsById) return "Carrito no encontrado"
        let productById = await productAll.exist(productId);
        if(!cartsById) return "Producto no encontrado"

        let cartsAll = await this.readCarts();
        let cartFilter = cartsAll.filter(cart => cart.id != cartId)

        if (cartsById.products.some(prod => prod.id === productId)){
            let productInCart = cartsById.products.find(prod => prod.id === productId)
            productInCart.cantidad++
            let cartsConcat = [productInCart, ...cartFilter]
            await this.writeCarts(cartConcat);
            return "Producto sumado al carrito";
        }
        


        let cartConcat = [{id:cartId, products: [{productById, cantidad: 1}]}, ...cartFilter]
        await this.writeCarts(cartConcat);
        return "Producto agregado al carrito";
    }
}

export default CartManager