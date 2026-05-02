import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import {
  Product,
  ProductRepository,
} from "../infra/repositories/products-repository";
import Decimal from "decimal.js";

const getProductByIdSchema = z.object({
  id: z.string().uuid(),
});

type GetProductByIdParams = z.infer<typeof getProductByIdSchema>;

export class ProductsController {
  constructor(private repository = new ProductRepository()) {}

  private createProductDTO(product: Product) {
    const price = new Decimal(product.price).toNumber();
    return {
      id: product.id,
      name: product.name,
      price,
      imageUrl: product.imageUrl,
      stock: product.stock,
    };
  }

  async getAllProducts(_: FastifyRequest, reply: FastifyReply) {
    try {
      const products = await this.repository.getAllProducts();

      return reply.status(200).send(products.map(this.createProductDTO));
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

      return reply.status(200).send(this.createProductDTO(product));
    } catch (error) {
      return reply.status(400).send({ error: "Invalid product ID" });
    }
  }
}
