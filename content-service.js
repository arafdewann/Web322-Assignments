const fs = require("fs");

let articles = [];
let categories = [];

module.exports = {
  initialize: function () {
    return new Promise((resolve, reject) => {
      fs.readFile("./data/articles.json", "utf8", (err, data) => {
        if (err) {
          reject("unable to read file");
        } else {
          articles = JSON.parse(data);

          fs.readFile("./data/categories.json", "utf8", (err, data) => {
            if (err) {
              reject("unable to read file");
            } else {
              categories = JSON.parse(data);
              resolve();
            }
          });
        }
      });
    });
  },
  getPublishedArticles: function () {
    return new Promise((resolve, reject) => {
      const publishedArticles = articles.filter(
        (article) => article.published === true
      );
      if (publishedArticles.length > 0) {
        resolve(publishedArticles);
      } else {
        reject("no results returned");
      }
    });
  },
  getCategories: function () {
    return new Promise((resolve, reject) => {
      if (categories.length > 0) {
        resolve(categories);
      } else {
        reject("no results returned");
      }
    });
  },
};