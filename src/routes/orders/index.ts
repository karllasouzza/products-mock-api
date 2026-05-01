import { type FastifyPluginAsync } from "fastify";
import { OrdersController } from "../../controllers/orders-controller";

const orders: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const controller = new OrdersController();

  fastify.get("/:id", controller.getOrderById.bind(controller));

  fastify.post("/", controller.createOrder.bind(controller));
};

export default orders;
