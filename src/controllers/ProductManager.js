import {promises as fs} from 'fs';
import {nanoid} from 'nanoid';

class ProductManager{
    constructor(){
        this.path = "./src/models/products.json"
    }

    readProducts = async () =>{
        let products = await fs.readFile(this.path, "utf-8");
        return JSON.parse(products);
    }

    writeProducts = async (producto)=>{
        await fs.writeFile(this.path, JSON.stringify(producto));
    }

    addProducts = async (producto) =>{
        let productsOld = await this.readProducts();
        producto.id = nanoid();
        let productAll = [...productsOld, producto];
        await this.writeProducts(productAll);
        return "Producto agregado"
    }

    getProducts = async ()=>{
        return await this.readProducts();
    }

    getProductsById = async (id)=>{
        let productsById = await this.exist(id);
        if(!productsById) return "Producto no encontrado"
        return productsById;
    }

    exist = async (id) =>{
        let products = await this.readProducts();
        return products.find(prod => prod.id === id);
    }

    updateProducts = async(id, product) => {
        let productsById = await this.exist(id);
        if(!productsById) return "Producto no encontrado"
        await this.deleteProducts(id);
        let productOld = await this.readProducts();
        let products = [{...product, id : id}, ...productOld];
        await this.writeProducts(products);
        return "Producto actualizado";
    }

    deleteProducts = async (id)=>{
        let products = await this.readProducts();
        let existProduct = products.some(prod => prod.id === id);
        if(existProduct){
            let filterProducts = products.filter(prod => prod.id != id);
            await this.writeProducts(filterProducts);
            return "Producto eliminado"
        }
        return "Producto inexistente"
    }
}

export default ProductManager;

