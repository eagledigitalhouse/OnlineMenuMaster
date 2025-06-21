import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema, insertCountrySchema, insertDishSchema, insertDishViewSchema, insertBannerSchema, insertEventoSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Countries routes
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.post("/api/countries", async (req, res) => {
    try {
      const validatedData = insertCountrySchema.parse(req.body);
      const country = await storage.createCountry(validatedData);
      res.status(201).json(country);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create country" });
      }
    }
  });

  app.put("/api/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCountrySchema.parse(req.body);
      const country = await storage.updateCountry(id, validatedData);
      if (!country) {
        res.status(404).json({ error: "Country not found" });
        return;
      }
      res.json(country);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update country" });
      }
    }
  });

  app.delete("/api/countries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCountry(id);
      if (!success) {
        res.status(404).json({ error: "Country not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete country" });
    }
  });

  // Dishes routes
  app.get("/api/dishes", async (req, res) => {
    try {
      const { country, category, search, featured } = req.query;
      const dishes = await storage.getDishes({
        countryId: country ? parseInt(country as string) : undefined,
        category: category as string,
        search: search as string,
        featured: featured === 'true',
      });
      res.json(dishes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dishes" });
    }
  });

  app.get("/api/dishes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dish = await storage.getDishById(id);
      if (!dish) {
        res.status(404).json({ error: "Dish not found" });
        return;
      }
      res.json(dish);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dish" });
    }
  });

  app.post("/api/dishes", async (req, res) => {
    try {
      const validatedData = insertDishSchema.parse(req.body);
      const dish = await storage.createDish(validatedData);
      res.status(201).json(dish);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create dish" });
      }
    }
  });

  app.put("/api/dishes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDishSchema.parse(req.body);
      const dish = await storage.updateDish(id, validatedData);
      if (!dish) {
        res.status(404).json({ error: "Dish not found" });
        return;
      }
      res.json(dish);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update dish" });
      }
    }
  });

  app.delete("/api/dishes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDish(id);
      if (!success) {
        res.status(404).json({ error: "Dish not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dish" });
    }
  });

  // Dish views tracking
  app.post("/api/dishes/:id/view", async (req, res) => {
    try {
      const dishId = parseInt(req.params.id);
      const ipAddress = req.ip || req.connection.remoteAddress;
      await storage.recordDishView({ dishId, ipAddress });
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to record view" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // In a real app, use proper session management
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Reorder countries
  app.put("/api/countries/reorder", async (req, res) => {
    try {
      const { countryIds } = req.body;
      await storage.reorderCountries(countryIds);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to reorder countries" });
    }
  });

  // Banners routes
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch banners" });
    }
  });

  app.post("/api/banners", async (req, res) => {
    try {
      const validatedData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(validatedData);
      res.status(201).json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create banner" });
      }
    }
  });

  app.put("/api/banners/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBannerSchema.parse(req.body);
      const banner = await storage.updateBanner(id, validatedData);
      if (!banner) {
        res.status(404).json({ error: "Banner not found" });
        return;
      }
      res.json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update banner" });
      }
    }
  });

  app.delete("/api/banners/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBanner(id);
      if (!success) {
        res.status(404).json({ error: "Banner not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete banner" });
    }
  });

  // Eventos routes
  app.get("/api/eventos", async (req, res) => {
    try {
      const { dia } = req.query;
      const eventos = await storage.getEventos(dia as string);
      res.json(eventos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch eventos" });
    }
  });

  app.get("/api/eventos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const evento = await storage.getEventoById(id);
      if (!evento) {
        res.status(404).json({ error: "Evento not found" });
        return;
      }
      res.json(evento);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch evento" });
    }
  });

  app.post("/api/eventos", async (req, res) => {
    try {
      const validatedData = insertEventoSchema.parse(req.body);
      const evento = await storage.createEvento(validatedData);
      res.status(201).json(evento);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create evento" });
      }
    }
  });

  app.put("/api/eventos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEventoSchema.parse(req.body);
      const evento = await storage.updateEvento(id, validatedData);
      if (!evento) {
        res.status(404).json({ error: "Evento not found" });
        return;
      }
      res.json(evento);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update evento" });
      }
    }
  });

  app.delete("/api/eventos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvento(id);
      if (!success) {
        res.status(404).json({ error: "Evento not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete evento" });
    }
  });

  // Upload em lote de pratos
  app.post("/api/dishes/bulk", async (req, res) => {
    try {
      console.log("🚀 Iniciando upload em lote de pratos...");
      
      const pratosData = req.body;
      
      if (!Array.isArray(pratosData)) {
        return res.status(400).json({ 
          error: "Dados devem ser um array de pratos",
          example: [{ name: "Nome", description: "Desc", price: "10.00", countryId: 49, category: "salgados" }]
        });
      }

      console.log(`📊 Recebidos ${pratosData.length} pratos para upload...`);

      // Validar estrutura básica
      for (let i = 0; i < pratosData.length; i++) {
        const prato = pratosData[i];
        if (!prato.name || !prato.description || !prato.price || !prato.countryId || !prato.category) {
          return res.status(400).json({
            error: `Prato ${i + 1} está com dados incompletos`,
            prato: prato,
            required: ["name", "description", "price", "countryId", "category"]
          });
        }
      }

      console.log("✅ Validação passou!");

      // Inserir pratos no banco
      let sucessos = 0;
      let erros = [];

      for (const prato of pratosData) {
        try {
          const novoPrato = await storage.createDish({
            name: prato.name,
            description: prato.description,
            price: prato.price,
            image: prato.image || null,
            countryId: prato.countryId,
            category: prato.category,
            tags: prato.tags || [],
            allergens: prato.allergens || [],
            rating: prato.rating || "0.00",
            reviewCount: prato.reviewCount || 0,
            isFeatured: prato.isFeatured || false,
            isAvailable: prato.isAvailable !== false,
            order: prato.order || 0
          });

          console.log(`✅ ${sucessos + 1}. "${novoPrato.name}" adicionado!`);
          sucessos++;
        } catch (error) {
          console.log(`❌ Erro ao adicionar "${prato.name}":`, error);
          erros.push({ prato: prato.name, erro: error.message });
        }
      }

      console.log(`🎉 Upload concluído! Sucessos: ${sucessos}, Erros: ${erros.length}`);

      res.json({
        message: "Upload em lote concluído!",
        sucessos,
        erros: erros.length,
        total: pratosData.length,
        detalhesErros: erros
      });

    } catch (error) {
      console.error("❌ Erro crítico no upload:", error);
      res.status(500).json({ error: "Erro interno no upload", details: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
