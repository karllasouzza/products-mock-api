import { FastifyReply, FastifyRequest } from "fastify";
import crypto from "node:crypto";
import z from "zod";
import { OrderRepository, Order } from "../infra/repositories/order-repository";
import { ProductRepository } from "../infra/repositories/products-repository";
import Decimal from "decimal.js";

const getOrderByIdSchema = z.object({
  id: z.string().uuid(),
});
type GetOrderByIdParams = z.infer<typeof getOrderByIdSchema>;

const createOrderSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    }),
  ),
});
type CreateOrderBody = z.infer<typeof createOrderSchema>;

export class OrdersController {
  constructor(
    private repository = new OrderRepository(),
    private productRepository = new ProductRepository(),
  ) {}

  private async _createOrderDTO(order: Order) {
    const items = await this.productRepository.getManyProductsByIds(
      order.products.map((p) => p.productId),
    );

    const itemsWithSubtotal = items.map((item) => {
      const orderItem = order.products.find((p) => p.productId === item.id);
      const quantity = orderItem
        ? new Decimal(orderItem.quantity)
        : new Decimal(0);
      const subtotal = item.price.mul(quantity).toNumber();
      return {
        ...item,
        price: item.price.toNumber(),
        quantity: quantity.toNumber(),
        subtotal,
      };
    });

    const total = itemsWithSubtotal
      .reduce((sum, it) => {
        return sum.plus(it.subtotal ?? new Decimal(0));
      }, new Decimal(0))
      .toNumber();

    return {
      id: order.id,
      status: order.status,
      items: itemsWithSubtotal,
      total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  async getOrderById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as GetOrderByIdParams;

    if (!id) {
      reply.status(400).send({ error: "Order ID is required" });
      return;
    }

    const order = await this.repository.getOrderById(id);

    if (!order) {
      reply.status(404).send({ error: "Order not found" });
      return;
    }

    return reply.status(200).send(await this._createOrderDTO(order));
  }

  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    try {
      createOrderSchema.parse(request.body);

      const { products } = request.body as CreateOrderBody;

      const productIds = products.map((p) => p.productId);
      const existingProducts =
        await this.productRepository.getManyProductsByIds(productIds);

      if (existingProducts.length !== productIds.length) {
        reply.status(400).send({ error: "One or more products not found" });
        return;
      }

      const newOrderObject: Pick<Order, "id" | "products" | "status"> = {
        id: crypto.randomUUID(),
        products,
        status: "pending",
      };

      const newOrder = await this.repository.createOrder(newOrderObject);
      if (!newOrder) {
        reply.status(500).send({ error: "Failed to create order" });
        return;
      }

      reply.status(201).send(await this._createOrderDTO(newOrder));
      return;
    } catch (error) {
      console.log("Error creating order:", error);
      reply.status(400).send({ error: "Invalid request body" });
      return;
    }
  }
}
