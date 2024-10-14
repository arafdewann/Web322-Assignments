const express = require("express");
const path = require("path"); // {{ edit_1 }}
const app = express();
const port = 3243;
const contentService = require("./content-service");

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize content service
contentService
  .initialize()
  .then(() => {
    console.log("Content service initialized");

    // Serve 'about.html' from the root route
    app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html")); 
    });

    // Serve 'about.html' from the '/about' route
    app.get("/about", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html")); // Updated to serve 'about.html'
    });

    app.get("/articles", (req, res) => {
      contentService
        .getPublishedArticles()
        .then((articles) => {
          res.json(articles);
        })
        .catch((err) => {
          res.status(500).json({ message: "Internal Server Error", error: err.message }); // {{ edit_3 }}
        });
    });

    app.get("/categories", (req, res) => {
      contentService
        .getCategories()
        .then((categories) => {
          res.json(categories);
        })
        .catch((err) => {
          res.status(500).json({ message: "Internal Server Error", error: err.message }); // {{ edit_4 }}
        });
    });

    // Favicon request handler
    app.get("/favicon.ico", (req, res) => {
      res.status(204).end(); // {{ edit_1 }}
    });

    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
