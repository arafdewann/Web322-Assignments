const path = require("path");
const fs = require("fs").promises;

let articles = [];
let categories = [];

module.exports = {
  initialize: async function () {
    try {
      const articlesPath = path.join(__dirname, "data", "articles.json");
      const categoriesPath = path.join(__dirname, "data", "categories.json");

      const articlesData = await fs.readFile(articlesPath, "utf8");
      articles = JSON.parse(articlesData);

      const categoriesData = await fs.readFile(categoriesPath, "utf8");
      categories = JSON.parse(categoriesData);
    } catch (err) {
      throw new Error(
        "Unable to read file: " +
          err.message +
          ". Please ensure the file exists."
      );
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

  addArticle: function (articleData) {
    articleData.published = !!articleData.published ? true : false; // Ensures published is a boolean
    articleData.id = articles.length + 1;
    articles.push(articleData);
    return articleData;
  },

  // Helper function to map categoryId to categoryName
  mapCategoryNames: function (articles) {
    return articles.map((article) => {
      const category = categories.find((cat) => cat.id === article.categoryId);
      return {
        ...article,
        categoryName: category ? category.name : "Unknown Category", // Default if not found
      };
    });
  },

  getArticlesByCategory: function (category) {
    const filteredArticles = articles.filter(
      (article) => article.category === category
    );
    return filteredArticles.length > 0 ? filteredArticles : [];
  },

  getArticlesByMinDate: function (minDateStr) {
    const minDate = new Date(minDateStr);
    const filteredArticles = articles.filter(
      (article) => new Date(article.articleDate) >= minDate
    );
    return filteredArticles.length > 0 ? filteredArticles : [];
  },

  getArticleById: function (id) {
    return new Promise((resolve, reject) => {
      const foundArticle = articles.find((article) => article.id == id);
      if (foundArticle) {
        const articleWithCategory = {
          ...foundArticle,
          categoryName:
            categories.find((cat) => cat.id === foundArticle.categoryId)
              ?.name || "Unknown Category",
        };
        resolve(articleWithCategory); // Resolve with the article including categoryName
      } else {
        reject("Article not found"); // Reject with a message if not found
      }
    });
  },

  getAllArticles: function () {
    return new Promise((resolve, reject) => {
      if (articles.length > 0) {
        resolve(articles); // Resolve with the array of articles
      } else {
        reject(new Error("No articles found")); // Reject if no articles are available
      }
    });
  },
};
