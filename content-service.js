const path = require('path');
const fs = require('fs').promises;

let articles = [];
let categories = [];

module.exports = {
  initialize: async function () {
    try {
      const articlesPath = path.join(__dirname, 'data', 'articles.json');
      const categoriesPath = path.join(__dirname, 'data', 'categories.json');
      
      const articlesData = await fs.readFile(articlesPath, 'utf8');
      articles = JSON.parse(articlesData);

      const categoriesData = await fs.readFile(categoriesPath, 'utf8');
      categories = JSON.parse(categoriesData);
    } catch (err) {
      throw new Error("Unable to read file: " + err.message + ". Please ensure the file exists.");
    }
  },
  getPublishedArticles: function () {
    return new Promise((resolve, reject) => {
      const publishedArticles = articles.filter(
        (article) => article.published === true
      );
      if (publishedArticles.length > 0) {
        resolve(publishedArticles);
      } else {
        reject(new Error("No results returned"));
      }
    });
  },
  getCategories: function () {
    return new Promise((resolve, reject) => {
      if (categories.length > 0) {
        resolve(categories);
      } else {
        reject(new Error("No results returned"));
      }
    });
  },
};
