import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  flagEmoji: varchar("flag_emoji", { length: 10 }).notNull(),
  flagImage: text("flag_image"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dishes = pgTable("dishes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"),
  countryId: integer("country_id").notNull().references(() => countries.id),
  category: varchar("category", { length: 50 }).notNull(), // salgados, doces, bebidas
  tags: text("tags").array().default([]), // vegetariano, vegano, picante, etc
  allergens: text("allergens").array().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  isAvailable: boolean("is_available").notNull().default(true),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dishViews = pgTable("dish_views", {
  id: serial("id").primaryKey(),
  dishId: integer("dish_id").notNull().references(() => dishes.id),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
});

// Relations
export const countryRelations = relations(countries, ({ many }) => ({
  dishes: many(dishes),
}));

export const dishRelations = relations(dishes, ({ one, many }) => ({
  country: one(countries, {
    fields: [dishes.countryId],
    references: [countries.id],
  }),
  views: many(dishViews),
}));

export const dishViewRelations = relations(dishViews, ({ one }) => ({
  dish: one(dishes, {
    fields: [dishViews.dishId],
    references: [dishes.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
  createdAt: true,
});

export const insertDishSchema = createInsertSchema(dishes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDishViewSchema = createInsertSchema(dishViews).omit({
  id: true,
  viewedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;

export type Dish = typeof dishes.$inferSelect;
export type InsertDish = z.infer<typeof insertDishSchema>;

export type DishView = typeof dishViews.$inferSelect;
export type InsertDishView = z.infer<typeof insertDishViewSchema>;

// Extended types with relations
export type DishWithCountry = Dish & {
  country: Country;
};

export type CountryWithDishes = Country & {
  dishes: Dish[];
};
