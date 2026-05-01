import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { ProductRepository } from "../infra/repositories/products-repository";

const getProductByIdSchema = z.object({
  id: z.string().uuid(),
});

type GetProductByIdParams = z.infer<typeof getProductByIdSchema>;

export class ProductsController {
  constructor(private repository = new ProductRepository()) {}

  async getAllProducts(_: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await this.repository.getAllProducts();

      return reply.status(200).send(products);
    } catch (error) {
      console.log("Error fetching products:", error);
      return reply.status(500).send({ error: "Internal server error" });
    }
  }

  async getProductById(request: FastifyRequest, reply: FastifyReply) {
    try {
      getProductByIdSchema.parse(request.params);
      const { id } = request.params as GetProductByIdParams;

      if (!id) {
        reply.status(400).send({ error: "Product ID is required" });
        return;
      }

      const product = await this.repository.getProductById(id);

      if (!product) {
        reply.status(404).send({ error: "Product not found" });
        return;
      }

      return reply.status(200).send(product);
    } catch (error) {
      return reply.status(400).send({ error: "Invalid product ID" });
    }
  }
}
