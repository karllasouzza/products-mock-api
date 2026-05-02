import { db } from "../knex/database";
import Decimal from "decimal.js";

export interface Product {
  id: string;
  name: string;
  price: Decimal;
  imageUrl: string;
  stock: number;
}

export class ProductRepository {
  constructor(private instance = db) {}

  private _rowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      price: new Decimal(row.price),
      imageUrl: row.imageUrl,
      stock: row.stock,
    };
  }

  public async getAllProducts(): Promise<Product[]> {
    const rows = await this.instance("products").select("*");
    return rows.map(this._rowToProduct);
  }

  public async getManyProductsByIds(ids: string[]): Promise<Product[]> {
    const rows = await this.instance("products").whereIn("id", ids).select("*");
    return rows.map(this._rowToProduct);
  }

  public async getProductById(id: string): Promise<Product | null> {
    const row = await this.instance("products").where({ id }).first();
    return row ? this._rowToProduct(row) : null;
  }
}
