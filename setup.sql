CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    published BOOLEAN NOT NULL,
    category VARCHAR(100) NOT NULL
);


-- Sample insert queries for the provided data

-- Sample insert queries for the provided data
INSERT INTO categories (name) VALUES
('Programming'),
('AI'),
('Data');

INSERT INTO articles (title, content, author, published, category) VALUES
('Why I like JavaScript',
 'JavaScript is a critical programming language in the development of modern web applications. It allows developers to create interactive and dynamic content on websites, making the web more engaging for users. From simple animations to handling complex tasks like form validations and asynchronous data fetching, JavaScript is used widely across industries. It’s integrated directly into browsers, making it easy to run without additional software installations. JavaScript frameworks like React, Angular, and Vue have made it indispensable for building powerful user interfaces. Its importance continues to grow as more businesses adopt web-based solutions for their services, with JavaScript playing a key role in both front-end and back-end development (via Node.js).',
 'MD ARAFAT KOYES',
 true,
 'Programming');

INSERT INTO articles (title, content, author, published, category) VALUES
('Will AI take our jobs',
 'Artificial Intelligence (AI) is transforming industries by automating processes, enhancing decision-making, and improving efficiency. In the future, AI is expected to revolutionize fields such as healthcare, finance, transportation, and education. With machine learning, AI systems can analyze vast amounts of data to predict trends, identify patterns, and even make decisions without human intervention. The rise of AI-powered assistants, autonomous vehicles, and smart homes demonstrates how AI is becoming a crucial part of everyday life. The ethical implications of AI, such as job displacement and privacy concerns, are areas of ongoing debate. However, the benefits of AI, including personalized services, improved healthcare diagnostics, and enhanced cybersecurity, position it as a key technology for the future.',
 'MD ARAFAT KOYES',
 false,
 'Technology');

INSERT INTO articles (title, content, author, published, category) VALUES
('Understanding Databases for Tech',
 'Databases are essential for storing and managing data in virtually every digital system. They organize data in a way that makes it easy to retrieve, update, and manage. Databases are used in a wide variety of applications, from e-commerce websites to financial systems, social media platforms, and even personal mobile apps. They help ensure data integrity, security, and efficient access, making them crucial in decision-making processes for businesses. SQL databases, such as MySQL and PostgreSQL, are used for structured data, while NoSQL databases, such as MongoDB, handle unstructured or semi-structured data. As data grows in volume and complexity, understanding databases and their importance in data management is critical for both developers and businesses.',
 'MD ARAFAT KOYES',
 true,
 'Database');
