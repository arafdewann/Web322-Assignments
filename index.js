const express = require("express");
const app = express();
const port = 3243;
const contentService = require("./content-service");

app.use(express.static("public"));

// Initialize content service
contentService
  .initialize()
  .then(() => {
    console.log("Content service initialized");

    app.get("/", (req, res) => {
      res.redirect("/home");
    });


    // Serve 'about.html' from the 'views' folder
    app.get("/about", (req, res) => {
      res.sendFile(__dirname + "/views/about.html");
    });

    app.get("/articles", (req, res) => {
      contentService
        .getPublishedArticles()
        .then((articles) => {
          res.json(articles);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    });

    app.get("/categories", (req, res) => {
      contentService
        .getCategories()
        .then((categories) => {
          res.json(categories);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    });

    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });