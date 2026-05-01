import { type FastifyPluginAsync } from "fastify";
import { ProductsController } from "../../controllers/products-controller";

const products: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const controller = new ProductsController();

  fastify.get("/", controller.getAllProducts.bind(controller));
  fastify.get("/:id", controller.getProductById.bind(controller));
};

export default products;
