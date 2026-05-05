import { randomUUID } from "node:crypto";
import { testConnection, db } from "../database";

const PRODUCTS_MOCK = [
  {
    name: "Camiseta Farm Estampada",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/dfc84ea8cad1238729a624a870825dadb43a33fc.jpg",
    price: "89.90",
    stock: 50,
  },
  {
    name: "Vestido Midi Farm Floral",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/85aee8dbce826dff9a0c0e69b7b2d618a73c2431.jpg",
    price: "199.90",
    stock: 30,
  },
  {
    name: "Tênis Fila Branco Casual",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/bf5bc1c16a19cb3699c9af3647c6abefd29e854f.jpg",
    price: "299.90",
    stock: 40,
  },
  {
    name: "Sandália Havaianas Power",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/d6ba1e5db84006971b5935f937879e0ae3a1e391.jpg",
    price: "79.90",
    stock: 100,
  },
  {
    name: "Bolsa de Ráfia Verão",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/42f12b29ee34b3fc7fb20a2b4a619aab0425cced.jpg",
    price: "129.90",
    stock: 25,
  },
  {
    name: "Chapéu de Ráfia Natural",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c87dbc094337372af51afcd0e49702d5731f3726.jpg",
    price: "89.90",
    stock: 35,
  },
  {
    name: "Óculos Sol Redondo Degradê",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/f121d86af445875d18e3ebc51adf30f13179c7fb.jpg",
    price: "149.90",
    stock: 60,
  },
  {
    name: "Brinco Grande Resina Flor",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/53086848dbc2d8dc7e7bdf5bdddc978eb4fd8821.jpg",
    price: "49.90",
    stock: 80,
  },
  {
    name: "Broche Colorido Lapela",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/885939b49e839d6d0fa9d6fb3da82996da248aa7.jpg",
    price: "39.90",
    stock: 0,
  },
  {
    name: "Short Jeans com Franjas",
    imageUrl:
      "https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7c35f31f1cbd0ae2c81c043e9459f0a02cff89cd.jpg",
    price: "159.90",
    stock: 0,
  },
];

async function mockProducts() {
  try {
    await testConnection();

    const tableExists = await db.schema.hasTable("products");

    if (!tableExists) {
      console.log("Products table does not exist");
      return;
    }

    await db("products").insert(
      PRODUCTS_MOCK.map((product) => ({
        ...product,
        id: randomUUID(),
      })),
    );
  } catch (error) {
    console.error("Error inserting products:", error);
  } finally {
    await db.destroy();
  }
}

mockProducts();
