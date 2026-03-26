import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getAllPosts, getPostBySlug } from "./blog";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Blog API routes
  app.get("/api/blog", (_req, res) => {
    const posts = getAllPosts();
    res.json(posts);
  });

  app.get("/api/blog/:slug", (req, res) => {
    const post = getPostBySlug(req.params.slug);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  });

  return httpServer;
}
