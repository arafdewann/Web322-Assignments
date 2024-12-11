const express = require("express");
const path = require("path");
const fs = require("fs");
const contentService = require("./content-service");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const app = express();
const port = 3243;

cloudinary.config({
  cloud_name: "dpy8pnzaq",
  api_key: "317115569113495",
  api_secret: "qfJW8rOkDLsoOxJH7Gn74XQRpYk",
  secure: true,
});

const upload = multer();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// Initialize content service
contentService
  .initialize()
  .then(() => {
    console.log("Content service initialized");

    // Serve the 'about' page using EJS
    app.get("/", (req, res) => {
      res.render("about"); // Renders views/about.ejs
    });

    app.get("/about", (req, res) => {
      res.render("about"); // Renders views/about.ejs
    });

    // Display the add article form
    app.get("/articles/add", (req, res) => {
      const categoriesFilePath = path.join(
        __dirname,
        "data",
        "categories.json"
      );

      fs.readFile(categoriesFilePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading categories.json:", err);
          return res.status(500).send("Error loading categories.");
        }

        try {
          const categories = JSON.parse(data);
          res.render("addArticle", { categories });
        } catch (jsonErr) {
          console.error("Error parsing categories.json:", jsonErr);
          return res.status(500).send("Error parsing categories.");
        }
      });
    });

    // Handle form submission to add a new article
    app.post(
      "/articles/add",
      upload.single("featureImage"),
      async (req, res) => {
        try {
          let imageUrl = "";

          if (req.file) {
            imageUrl = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                  if (result) {
                    resolve(result.url);
                  } else {
                    reject(error);
                  }
                }
              );
              streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
          }

          req.body.featureImage = imageUrl;

          const newArticle = await contentService.addArticle(req.body);
          res.redirect("/articles");
        } catch (err) {
          res
            .status(500)
            .json({ message: "Error occurred", error: err.message });
        }
      }
    );

    // List all articles
    app.get("/articles", (req, res) => {
      contentService
        .getAllArticles()
        .then((articles) => {
          res.render("articles", { articles, error: null, article: null });
        })
        .catch((err) => {
          res.render("articles", {
            articles: [],
            error: "Error fetching articles",
            article: null,
          });
        });
    });

    // Route for fetching an article by ID
    app.get("/articles/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10); // Ensure the ID is an integer
      if (isNaN(id)) {
        return res.status(400).render("articles", {
          error: "Invalid article ID",
          articles: [],
          article: null,
        });
      }

      try {
        const article = await contentService.getArticleById(id);
        if (!article) {
          return res.render("articles", {
            article: null,
            error: "Article not found",
            articles: [],
          });
        }
        res.render("articles", { article, error: null, articles: [] });
      } catch (err) {
        console.error(err);
        res.status(500).render("articles", {
          article: null,
          error: "Error fetching article",
          articles: [],
        });
      }
    });

    // Categories route
    app.get("/categories", (req, res) => {
      contentService
        .getCategories()
        .then((categories) => {
          res.render("categories", { categories });
        })
        .catch((err) => {
          res.status(500).render("error", {
            message: "Internal Server Error",
            error: err.message,
          });
        });
    });

    // Update an article form
    app.get("/articles/edit/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).send("Invalid article ID.");
      }

      try {
        const article = await contentService.getArticleById(id);
        const categoriesFilePath = path.join(
          __dirname,
          "data",
          "categories.json"
        );
        const categories = JSON.parse(
          fs.readFileSync(categoriesFilePath, "utf8")
        );
        res.render("editArticle", { article, categories });
      } catch (err) {
        res.status(500).send("Error retrieving article for editing.");
      }
    });

    // Handle updating an article
    app.post(
      "/articles/edit/:id",
      upload.single("featureImage"),
      async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
          return res.status(400).send("Invalid article ID.");
        }

        try {
          let imageUrl = req.body.featureImage || "";

          if (req.file) {
            imageUrl = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                  if (result) {
                    resolve(result.url);
                  } else {
                    reject(error);
                  }
                }
              );
              streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
          }

          req.body.featureImage = imageUrl;
          await contentService.updateArticle(id, req.body);
          res.redirect("/articles");
        } catch (err) {
          console.error("Error updating the article:", err);
          res.status(500).send("Error updating the article.");
        }
      }
    );

    // Delete an article
    app.post("/articles/delete/:id", async (req, res) => {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).send("Invalid article ID.");
      }

      try {
        await contentService.deleteArticle(id);
        res.redirect("/articles");
      } catch (err) {
        console.error("Error deleting the article:", err);
        res.status(500).send("Error deleting the article.");
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
