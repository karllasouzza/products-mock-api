import { db } from "../knex/database";

export interface Order {
  id: string;
  productId: string;
  quantity: number;
}

export class OrderRepository {
  constructor(private instance = db) {}

  async createOrder({
    id,
    productId,
    quantity,
  }: Pick<Order, "id" | "productId" | "quantity">) {
    const newOrder = await this.instance("orders")
      .insert({
        id,
        productId,
        quantity,
      })
      .returning("*");
    return newOrder;
  }

  async getOrderById(id: string) {
    const order = await this.instance("orders").where({ id }).first();
    return order;
  }
}
