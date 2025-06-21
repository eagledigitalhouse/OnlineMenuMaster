import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar, date, time } from "drizzle-orm/pg-core";
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
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"), // avaliação média
  reviewCount: integer("review_count").default(0), // número de avaliações
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

export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  image: text("image").notNull(),
  link: text("link"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const eventos = pgTable("eventos", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 200 }).notNull(),
  descricao: text("descricao").notNull(),
  dia: date("dia").notNull(), // formato de data (20/06/2025)
  horario_inicio: time("horario_inicio").notNull(),
  horario_fim: time("horario_fim").notNull(),
  local: varchar("local", { length: 150 }).notNull(),
  imagem_url: text("imagem_url"),
  countryId: integer("country_id").references(() => countries.id),
  isFeatured: boolean("is_featured").notNull().default(false), // eventos em destaque
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const countryRelations = relations(countries, ({ many }) => ({
  dishes: many(dishes),
  eventos: many(eventos),
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

export const eventoRelations = relations(eventos, ({ one }) => ({
  country: one(countries, {
    fields: [eventos.countryId],
    references: [countries.id],
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

export const insertBannerSchema = createInsertSchema(banners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventoSchema = createInsertSchema(eventos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;

export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = z.infer<typeof insertEventoSchema>;

// Extended types with relations
export type DishWithCountry = Dish & {
  country: Country;
};

export type CountryWithDishes = Country & {
  dishes: Dish[];
};

export type EventoWithCountry = Evento & {
  country: Country | null;
};
