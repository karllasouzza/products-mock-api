import { db } from "../knex/database";

export interface Product {
  id: number;
  name: string;
  price: number;
}

export class ProductRepository {
  constructor(private instance = db) {}

  public async getAllProducts() {
    const products = await this.instance("products").select("*");
    return products;
  }

  public async getProductById(id: string) {
    const product = await this.instance("products").where({ id }).first();
    return product;
  }
}
