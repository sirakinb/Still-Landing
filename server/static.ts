import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { redirect: false }));

  // Prefer route-specific prerendered HTML before falling back to the SPA shell.
  app.use("*", (req, res) => {
    const normalizedPath = path
      .normalize(req.path)
      .replace(/^(\.\.[/\\])+/, "")
      .replace(/^[/\\]+/, "");
    const prerenderedPath = path.resolve(distPath, normalizedPath, "index.html");

    if (prerenderedPath.startsWith(distPath) && fs.existsSync(prerenderedPath)) {
      res.sendFile(prerenderedPath);
      return;
    }

    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
