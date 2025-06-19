import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema, insertCountrySchema, insertDishSchema, insertDishViewSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
