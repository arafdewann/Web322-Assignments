const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3243;
const contentService = require("./content-service");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dpy8pnzaq",
  api_key: "317115569113495",
  api_secret: "qfJW8rOkDLsoOxJH7Gn74XQRpYk",
  secure: true,
});

const upload = multer();

app.set("view engine", "ejs"); // Set EJS as the view engine
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// Initialize content service
contentService
  .initialize()
  .then(() => {
    console.log("Content service initialized");

    // Serve 'about' page using EJS
    app.get("/", (req, res) => {
      res.render("about"); // Renders views/about.ejs
    });

    app.get("/about", (req, res) => {
      res.render("about"); // Renders views/about.ejs
    });

    // Update the route to pass categories to the template
    app.get("/articles/add", (req, res) => {
      const categoriesFilePath = path.join(
        __dirname,
        "data",
        "categories.json"
      ); // Update path if necessary

      console.log("Reading categories from:", categoriesFilePath); // Log the path

      // Read categories from categories.json
      fs.readFile(categoriesFilePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading categories.json:", err); // Log the error
          return res.status(500).send("Error loading categories.");
        }

        try {
          // Parse the categories from the JSON file
          const categories = JSON.parse(data);

          // Render the AddArticle form with the categories
          res.render("addArticle", { categories });
        } catch (jsonErr) {
          console.error("Error parsing categories.json:", jsonErr); // Log JSON parse errors
          return res.status(500).send("Error parsing categories.");
        }
      });
    });

    // Handle form submission to add a new article
    // app.post(
    //   "/articles/add",
    //   upload.single("featureImage"),
    //   async (req, res) => {
    //     try {
    //       // Upload feature image to Cloudinary (if provided)
    //       const imageUrl = req.file
    //         ? (await cloudinary.uploader.upload(req.file.buffer)).url
    //         : "";

    //       // Add image URL to the body of the form submission
    //       req.body.featureImage = imageUrl;

    //       // Auto-generate article ID here (e.g., the next available ID)
    //       req.body.id = contentService.getNextArticleId(); // Ensure getNextArticleId() is defined in contentService

    //       // Add the article to your service or database
    //       await contentService.addArticle(req.body);

    //       // Redirect to the list of articles after adding the new article
    //       res.redirect("/articles");
    //     } catch (err) {
    //       res
    //         .status(500)
    //         .json({ message: "Error occurred", error: err.message });
    //     }
    //   }
    // );

    // Article retrieval and filtering routes
    // app.get("/articles", (req, res) => {
    //   const { category, minDate } = req.query;

    //   if (category) {
    //     contentService
    //       .getArticlesByCategory(category)
    //       .then((articles) => {
    //         res.render("articles", { articles, error: null });
    //       })
    //       .catch((err) => {
    //         res.render("articles", {
    //           articles: [],
    //           error: "Error fetching articles",
    //         });
    //       });
    //   } else if (minDate) {
    //     contentService
    //       .getArticlesByMinDate(minDate)
    //       .then((articles) => {
    //         res.render("articles", { articles, error: null });
    //       })
    //       .catch((err) => {
    //         res.render("articles", {
    //           articles: [],
    //           error: "Error fetching articles",
    //         });
    //       });
    //   } else {
    //     contentService
    //       .getAllArticles()
    //       .then((articles) => {
    //         res.render("articles", { articles, error: null });
    //       })
    //       .catch((err) => {
    //         res.render("articles", {
    //           articles: [],
    //           error: "Error fetching articles",
    //         });
    //       });
    //   }
    // });

    // Route to display a single article
    // app.get("/articles/:id", (req, res) => {
    //   const articleId = req.params.id;

    //   contentService
    //     .getArticleById(articleId)
    //     .then((article) => {
    //       // Map the article to include categoryName using mapCategoryNames helper
    //       const articleWithCategory = contentService.mapCategoryNames([
    //         article,
    //       ])[0]; // Wrap article in an array to use map function

    //       // Render the article with categoryName in 'articles.ejs'
    //       res.render("articles", { article: articleWithCategory });
    //     })
    //     .catch((err) => {
    //       console.error("Error fetching article:", err);
    //       res.status(404).send("Article not found");
    //     });
    // });

    app.post(
      "/articles/add",
      upload.single("featureImage"),
      async (req, res) => {
        try {
          let imageUrl = "";

          // Upload feature image to Cloudinary (if provided)
          if (req.file) {
            imageUrl = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                  if (result) {
                    resolve(result.url); // Get the image URL from Cloudinary
                  } else {
                    reject(error);
                  }
                }
              );

              // Pipe the buffer to the upload stream
              streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });
          }

          // Add image URL to the body of the form submission
          req.body.featureImage = imageUrl;

          // Add the article to your service or database
          const newArticle = contentService.addArticle(req.body);

          // Redirect to the list of articles after adding the new article
          res.redirect("/articles");
        } catch (err) {
          res
            .status(500)
            .json({ message: "Error occurred", error: err.message });
        }
      }
    );

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

    app.get("/articles/:id", (req, res) => {
      const articleId = req.params.id;

      contentService
        .getArticleById(articleId)
        .then((article) => {
          const articleWithCategory = contentService.mapCategoryNames([
            article,
          ])[0];
          res.render("articles", {
            article: articleWithCategory,
            articles: null,
            error: null,
          });
        })
        .catch((err) => {
          res.status(404).send("Article not found");
        });
    });

    app.set("views", path.join(__dirname, "views")); // Ensure this points to your views directory
    app.set("view engine", "ejs"); // Adjust if you're using another engine like pug

    // Categories route
    app.get("/categories", (req, res) => {
      contentService
        .getCategories()
        .then((categories) => {
          res.render("categories", { categories }); // Render categories.ejs
        })
        .catch((err) => {
          res.status(500).render("error", {
            message: "Internal Server Error",
            error: err.message,
          });
        });
    });

    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
