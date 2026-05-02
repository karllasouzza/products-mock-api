import { db } from "../knex/database";

export interface Order {
  id: string;
  products: { productId: string; quantity: number }[];
  status: "pending" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export class OrderRepository {
  constructor(private instance = db) {}

  async createOrder({
    id,
    products,
    status,
  }: Pick<Order, "id" | "products" | "status">) {
    await this.instance("orders").insert({
      id,
      products: JSON.stringify(products),
      status,
    });

    const row = await this.instance("orders").where({ id }).first();
    if (!row) return null;

    return {
      id: row.id,
      products:
        typeof row.products === "string"
          ? JSON.parse(row.products)
          : row.products,
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
    } as Order;
  }

  async getOrderById(id: string) {
    const row = await this.instance("orders").where({ id }).first();
    if (!row) return null;

    return {
      id: row.id,
      products:
        typeof row.products === "string"
          ? JSON.parse(row.products)
          : row.products,
      status: row.status,
      createdAt: row.created_at ? new Date(row.created_at) : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at) : undefined,
    } as Order;
  }
}
