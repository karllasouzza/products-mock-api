import { FastifyReply, FastifyRequest } from "fastify";
import crypto from "node:crypto";
import z from "zod";
import { OrderRepository } from "../infra/repositories/order-repository";

const getOrderByIdSchema = z.object({
  id: z.string().uuid(),
});
type GetOrderByIdParams = z.infer<typeof getOrderByIdSchema>;

const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number(),
});
type CreateOrderBody = z.infer<typeof createOrderSchema>;

export class OrdersController {
  constructor(private repository = new OrderRepository()) {}

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

    return reply.status(200).send(order);
  }

  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    try {
      createOrderSchema.parse(request.body);

      const { productId, quantity } = request.body as CreateOrderBody;

      const newOrderObject = {
        id: crypto.randomUUID(),
        productId,
        quantity,
      };

      const newOrder = await this.repository.createOrder(newOrderObject);
      if (!newOrder) {
        reply.status(500).send({ error: "Failed to create order" });
        return;
      }
      return newOrder;
    } catch (error) {
      console.log("Error creating order:", error);
      reply.status(400).send({ error: "Invalid request body" });
      return;
    }
  }
}
