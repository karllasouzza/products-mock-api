import { testConnection, db } from "./database";

async function createSchema() {
  try {
    await testConnection();

    const productsTableExists = await db.schema.hasTable("products");

    if (productsTableExists) {
      console.log("Products table already exists, dropping it...");
      await db.schema.dropTable("products");
    }

    await db.schema.createTable("products", (table) => {
      table.uuid("id").primary().notNullable();
      table.string("name", 200).notNullable();
      table.string("imageUrl", 500).notNullable();
      table.decimal("price", 10, 2).notNullable();
      table.integer("stock").unsigned().defaultTo(0);
      table.timestamps(true, true); // created_at and updated_at columns
    });
    console.log("Products table created successfully!");

    const ordersTableExists = await db.schema.hasTable("orders");

    if (ordersTableExists) {
      console.log("Orders table already exists, dropping it...");
      await db.schema.dropTable("orders");
    }

    await db.schema.createTable("orders", (table) => {
      table.uuid("id").primary().notNullable();
      table.json("products").notNullable();
      table.string("status", 20).notNullable().defaultTo("pending");
      table.timestamps(true, true);
    });

    console.log("Orders table created successfully!");
  } catch (error) {
    console.error("Error creating schema:", error);
  } finally {
    await db.destroy();
  }
}

createSchema();
