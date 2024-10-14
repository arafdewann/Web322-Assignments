const fs = require("fs");
const path = require("path");

let articles = [];
let categories = [];

module.exports = {
  initialize: function () {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, "data", "articles.json"), "utf8", (err, data) => {
        if (err) {
          reject("Unable to read articles.json file: " + err.message);
        } else {
          try {
            articles = JSON.parse(data);
          } catch (jsonErr) {
            reject("Error parsing articles.json file: " + jsonErr.message);
          }

          fs.readFile(path.join(__dirname, "data", "categories.json"), "utf8", (err, data) => {
            if (err) {
              reject("Unable to read categories.json file: " + err.message);
            } else {
              try {
                categories = JSON.parse(data);
                resolve(); // All files are read successfully, resolve the promise
              } catch (jsonErr) {
                reject("Error parsing categories.json file: " + jsonErr.message);
              }
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
        reject("No published articles found");
      }
    });
  },

  getCategories: function () {
    return new Promise((resolve, reject) => {
      if (categories.length > 0) {
        resolve(categories);
      } else {
        reject("No categories found");
      }
    });
  }
};
