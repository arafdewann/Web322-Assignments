require("dotenv").config(); // Load environment variables from the .env file

const { Pool } = require("pg");

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }, // Required for Neon.tech
});

module.exports = {
  // Initialize database connection
  initialize: async function () {
    try {
      console.log("Database initialized.");
    } catch (err) {
      throw new Error("Unable to initialize database: " + err.message);
    }
  },

  // Fetch all published articles from the database
  getPublishedArticles: function () {
    return pool
      .query("SELECT * FROM articles WHERE published = true")
      .then((res) => res.rows)
      .catch((err) => Promise.reject("No results returned"));
  },

  // Fetch all categories from the database
  getCategories: function () {
    return pool
      .query("SELECT * FROM categories")
      .then((res) => res.rows)
      .catch((err) => Promise.reject("No results returned"));
  },

  // Add a new article to the database
  addArticle: function (articleData) {
    const { title, content, categoryId, published } = articleData;
    const query = `
      INSERT INTO articles (title, content, category_id, published)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [title, content, categoryId, published];
    return pool
      .query(query, values)
      .then((res) => res.rows[0])
      .catch((err) => Promise.reject("Error adding article: " + err.message));
  },

  // Fetch articles by category
  getArticlesByCategory: function (category) {
    return pool
      .query("SELECT * FROM articles WHERE category_id = $1", [category])
      .then((res) => res.rows)
      .catch((err) =>
        Promise.reject("No articles found for category: " + category)
      );
  },

  // Fetch articles by date
  getArticlesByMinDate: function (minDateStr) {
    const minDate = new Date(minDateStr);
    return pool
      .query("SELECT * FROM articles WHERE article_date >= $1", [minDate])
      .then((res) => res.rows)
      .catch((err) => Promise.reject("No articles found after the given date"));
  },

  // Fetch a single article by its ID
  getArticleById: function (id) {
    return pool
      .query("SELECT * FROM articles WHERE id = $1", [id])
      .then((res) => {
        if (res.rows.length > 0) {
          return pool
            .query("SELECT name FROM categories WHERE id = $1", [
              res.rows[0].category_id,
            ])
            .then((catRes) => ({
              ...res.rows[0],
              categoryName:
                catRes.rows.length > 0
                  ? catRes.rows[0].name
                  : "Unknown Category",
            }));
        } else {
          return Promise.reject("Article not found");
        }
      })
      .catch((err) => Promise.reject("Error fetching article: " + err.message));
  },

  // Fetch all articles
  getAllArticles: function () {
    return pool
      .query("SELECT * FROM articles")
      .then((res) => res.rows)
      .catch((err) => Promise.reject("No articles found"));
  },

  updateArticle: async (id, articleData) => {
    const { title, content, author, featureImage, category } = articleData;

    try {
      const query = `
        UPDATE articles
        SET title = $1, content = $2, author = $3, featureImage = $4, category = $5
        WHERE id = $6;
      `;

      const values = [title, content, author, featureImage, category, id];
      await pool.query(query, values);
    } catch (err) {
      console.error("Error updating article:", err.message);
      throw err;
    }
  },

  deleteArticle: async (id) => {
    try {
      const query = `DELETE FROM articles WHERE id = $1;`;
      await pool.query(query, [id]);
    } catch (err) {
      console.error("Error deleting article:", err.message);
      throw err;
    }
  },
};
