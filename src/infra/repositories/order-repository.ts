import { db } from "../knex/database";

export interface Order {
  id: string;
  productId: string;
  quantity: number;
}

export class OrderRepository {
  constructor(private instance = db) {}

  async createOrder({
    productId,
    quantity,
  }: Pick<Order, "productId" | "quantity">) {
    const newOrder = await this.instance("Orders").insert({
      productId,
      quantity,
    });
    return newOrder;
  }

  async getOrderById(id: string) {
    const order = await this.instance("Orders").where({ id }).first();
    return order;
  }
}
