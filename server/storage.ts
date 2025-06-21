import { 
  users, 
  countries, 
  dishes, 
  dishViews,
  banners,
  eventos,
  type User, 
  type InsertUser,
  type Country,
  type InsertCountry,
  type Dish,
  type InsertDish,
  type DishWithCountry,
  type InsertDishView,
  type Banner,
  type InsertBanner,
  type Evento,
  type InsertEvento,
  type EventoWithCountry
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, desc } from "drizzle-orm";

export interface DishFilters {
  search?: string;
  countryId?: number;
  category?: string;
  featured?: boolean;
}

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;

  // Countries
  getCountries(): Promise<Country[]>;
  createCountry(insertCountry: InsertCountry): Promise<Country>;
  updateCountry(id: number, data: InsertCountry): Promise<Country | undefined>;
  deleteCountry(id: number): Promise<boolean>;
  reorderCountries(countryIds: number[]): Promise<void>;

  // Dishes
  getDishes(filters?: DishFilters): Promise<DishWithCountry[]>;
  getDishById(id: number): Promise<DishWithCountry | undefined>;
  createDish(insertDish: InsertDish): Promise<DishWithCountry>;
  updateDish(id: number, data: InsertDish): Promise<DishWithCountry | undefined>;
  deleteDish(id: number): Promise<boolean>;

  // Dish Views
  recordDishView(data: InsertDishView): Promise<void>;
  getDashboardStats(): Promise<any>;

  // Banners
  getBanners(): Promise<Banner[]>;
  createBanner(insertBanner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, data: InsertBanner): Promise<Banner | undefined>;
  deleteBanner(id: number): Promise<boolean>;

  // Eventos
  getEventos(dia?: string): Promise<EventoWithCountry[]>;
  getEventoById(id: number): Promise<EventoWithCountry | undefined>;
  createEvento(insertEvento: InsertEvento): Promise<EventoWithCountry>;
  updateEvento(id: number, data: InsertEvento): Promise<EventoWithCountry | undefined>;
  deleteEvento(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCountries(): Promise<Country[]> {
    return await db.select().from(countries).orderBy(countries.order, countries.name);
  }

  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const [country] = await db
      .insert(countries)
      .values(insertCountry)
      .returning();
    return country;
  }

  async updateCountry(id: number, data: InsertCountry): Promise<Country | undefined> {
    const [country] = await db
      .update(countries)
      .set(data)
      .where(eq(countries.id, id))
      .returning();
    return country || undefined;
  }

  async deleteCountry(id: number): Promise<boolean> {
    const result = await db.delete(countries).where(eq(countries.id, id));
    return (result.rowCount || 0) > 0;
  }

  async reorderCountries(countryIds: number[]): Promise<void> {
    for (let i = 0; i < countryIds.length; i++) {
      await db
        .update(countries)
        .set({ order: i })
        .where(eq(countries.id, countryIds[i]));
    }
  }

  async getDishes(filters: DishFilters = {}): Promise<DishWithCountry[]> {
    let query = db
      .select({
        id: dishes.id,
        name: dishes.name,
        description: dishes.description,
        price: dishes.price,
        image: dishes.image,
        countryId: dishes.countryId,
        category: dishes.category,
        tags: dishes.tags,
        allergens: dishes.allergens,
        isFeatured: dishes.isFeatured,
        isAvailable: dishes.isAvailable,
        order: dishes.order,
        createdAt: dishes.createdAt,
        updatedAt: dishes.updatedAt,
        country: {
          id: countries.id,
          name: countries.name,
          flagEmoji: countries.flagEmoji,
          flagImage: countries.flagImage,
          order: countries.order,
          isActive: countries.isActive,
          createdAt: countries.createdAt,
        },
      })
      .from(dishes)
      .innerJoin(countries, eq(dishes.countryId, countries.id));

    const conditions = [];

    if (filters.search) {
      conditions.push(ilike(dishes.name, `%${filters.search}%`));
    }
    if (filters.countryId) {
      conditions.push(eq(dishes.countryId, filters.countryId));
    }
    if (filters.category) {
      conditions.push(eq(dishes.category, filters.category));
    }
    if (filters.featured) {
      conditions.push(eq(dishes.isFeatured, true));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(countries.order, dishes.order, dishes.name);
  }

  async getDishById(id: number): Promise<DishWithCountry | undefined> {
    const [dish] = await db
      .select({
        id: dishes.id,
        name: dishes.name,
        description: dishes.description,
        price: dishes.price,
        image: dishes.image,
        countryId: dishes.countryId,
        category: dishes.category,
        tags: dishes.tags,
        allergens: dishes.allergens,
        isFeatured: dishes.isFeatured,
        isAvailable: dishes.isAvailable,
        order: dishes.order,
        createdAt: dishes.createdAt,
        updatedAt: dishes.updatedAt,
        country: {
          id: countries.id,
          name: countries.name,
          flagEmoji: countries.flagEmoji,
          flagImage: countries.flagImage,
          order: countries.order,
          isActive: countries.isActive,
          createdAt: countries.createdAt,
        },
      })
      .from(dishes)
      .innerJoin(countries, eq(dishes.countryId, countries.id))
      .where(eq(dishes.id, id));
    
    return dish || undefined;
  }

  async createDish(insertDish: InsertDish): Promise<DishWithCountry> {
    const [dish] = await db
      .insert(dishes)
      .values(insertDish)
      .returning();
    
    const dishWithCountry = await this.getDishById(dish.id);
    if (!dishWithCountry) {
      throw new Error("Failed to retrieve created dish");
    }
    return dishWithCountry;
  }

  async updateDish(id: number, data: InsertDish): Promise<DishWithCountry | undefined> {
    const [dish] = await db
      .update(dishes)
      .set(data)
      .where(eq(dishes.id, id))
      .returning();
    
    if (!dish) return undefined;
    
    return await this.getDishById(dish.id);
  }

  async deleteDish(id: number): Promise<boolean> {
    try {
      console.log(`🗑️ Iniciando exclusão do prato ID ${id}...`);
      
      // PASSO 1: Excluir todas as visualizações do prato primeiro
      const viewsResult = await db.delete(dishViews).where(eq(dishViews.dishId, id));
      console.log(`✅ ${viewsResult.rowCount || 0} visualizações removidas para o prato ${id}`);
      
      // PASSO 2: Agora excluir o prato
      const dishResult = await db.delete(dishes).where(eq(dishes.id, id));
      const success = (dishResult.rowCount || 0) > 0;
      
      if (success) {
        console.log(`✅ Prato ID ${id} excluído com sucesso!`);
      } else {
        console.log(`❌ Prato ID ${id} não foi encontrado ou já foi excluído`);
      }
      
      return success;
    } catch (error) {
      console.error(`❌ Erro crítico ao excluir prato ${id}:`, error);
      return false;
    }
  }

  async recordDishView(data: InsertDishView): Promise<void> {
    await db.insert(dishViews).values(data);
  }

  async getDashboardStats(): Promise<any> {
    const totalDishes = await db.select().from(dishes);
    const totalCountries = await db.select().from(countries);
    const allViews = await db.select().from(dishViews);

    return {
      totalDishes: totalDishes.length,
      totalCountries: totalCountries.length,
      todayViews: allViews.length,
    };
  }

  async getBanners(): Promise<Banner[]> {
    return await db.select().from(banners).orderBy(banners.order);
  }

  async createBanner(insertBanner: InsertBanner): Promise<Banner> {
    const [banner] = await db
      .insert(banners)
      .values(insertBanner)
      .returning();
    return banner;
  }

  async updateBanner(id: number, data: InsertBanner): Promise<Banner | undefined> {
    const [banner] = await db
      .update(banners)
      .set(data)
      .where(eq(banners.id, id))
      .returning();
    return banner || undefined;
  }

  async deleteBanner(id: number): Promise<boolean> {
    const result = await db.delete(banners).where(eq(banners.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Eventos methods
  async getEventos(dia?: string): Promise<EventoWithCountry[]> {
    const conditions = [eq(eventos.isActive, true)];
    
    if (dia) {
      conditions.push(eq(eventos.dia, dia));
    }
    
    return await db
      .select({
        id: eventos.id,
        titulo: eventos.titulo,
        descricao: eventos.descricao,
        dia: eventos.dia,
        horario_inicio: eventos.horario_inicio,
        horario_fim: eventos.horario_fim,
        local: eventos.local,
        imagem_url: eventos.imagem_url,
        countryId: eventos.countryId,
        isFeatured: eventos.isFeatured,
        order: eventos.order,
        isActive: eventos.isActive,
        createdAt: eventos.createdAt,
        updatedAt: eventos.updatedAt,
        country: {
          id: countries.id,
          name: countries.name,
          flagEmoji: countries.flagEmoji,
          flagImage: countries.flagImage,
          order: countries.order,
          isActive: countries.isActive,
          createdAt: countries.createdAt,
        },
      })
      .from(eventos)
      .leftJoin(countries, eq(eventos.countryId, countries.id))
      .where(and(...conditions))
      .orderBy(eventos.dia, eventos.horario_inicio, eventos.order);
  }

  async getEventoById(id: number): Promise<EventoWithCountry | undefined> {
    const [evento] = await db
      .select({
        id: eventos.id,
        titulo: eventos.titulo,
        descricao: eventos.descricao,
        dia: eventos.dia,
        horario_inicio: eventos.horario_inicio,
        horario_fim: eventos.horario_fim,
        local: eventos.local,
        imagem_url: eventos.imagem_url,
        countryId: eventos.countryId,
        isFeatured: eventos.isFeatured,
        order: eventos.order,
        isActive: eventos.isActive,
        createdAt: eventos.createdAt,
        updatedAt: eventos.updatedAt,
        country: {
          id: countries.id,
          name: countries.name,
          flagEmoji: countries.flagEmoji,
          flagImage: countries.flagImage,
          order: countries.order,
          isActive: countries.isActive,
          createdAt: countries.createdAt,
        },
      })
      .from(eventos)
      .leftJoin(countries, eq(eventos.countryId, countries.id))
      .where(eq(eventos.id, id));
    return evento || undefined;
  }

  async createEvento(insertEvento: InsertEvento): Promise<EventoWithCountry> {
    const [evento] = await db
      .insert(eventos)
      .values(insertEvento)
      .returning();
    
    const eventoWithCountry = await this.getEventoById(evento.id);
    if (!eventoWithCountry) {
      throw new Error("Failed to retrieve created evento");
    }
    return eventoWithCountry;
  }

  async updateEvento(id: number, data: InsertEvento): Promise<EventoWithCountry | undefined> {
    const [evento] = await db
      .update(eventos)
      .set(data)
      .where(eq(eventos.id, id))
      .returning();
    
    if (!evento) return undefined;
    
    return await this.getEventoById(evento.id);
  }

  async deleteEvento(id: number): Promise<boolean> {
    const result = await db.delete(eventos).where(eq(eventos.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
