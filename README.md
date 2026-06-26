# PURAI — AI-Powered Ingredient Analyzer

## 📌 Project Overview
**PURAI** is a full-stack web application developed as a university group project. The main objective of the application is to provide users with an intelligent tool for analyzing product ingredients (such as cosmetic INCI compositions) and checking their safety profiles using artificial intelligence.

The application features a responsive frontend, a modular PHP backend, a relational database, and a direct integration with the **Groq API** (utilizing Llama 3.3 and Llama 4 models) to deliver real-time, smart insights based on user queries without reloading the page.

## 👥 Team Members & Roles
Developed in collaboration by a university project team:
* **Viktoriia Karpets** — Frontend Development (HTML5, CSS3), UI Layout, and Database Design (SQL)
* Kseniya Lankovskaya — Backend Engineering & Groq API Integration (PHP, cURL)
* Lizaveta Suryna — Core Logic, Data Flow Handling & System Testing

## 🛠 Tech Stack
* **Frontend:** HTML5, CSS3, JavaScript (ES6, asynchronous AJAX via Fetch API)
* **Backend:** PHP (Modular architecture separating configuration, DB connection, and API requests)
* **Database:** MySQL / SQL (Relational database for storing user logs, histories, or product data)
* **AI Integration:** Groq API (Running Llama-3.3-70b-versatile & Llama-4 models via secure cURL requests)
* **Libraries:** jsPDF (Frontend PDF generation)

## 📂 Project Structure
```text
PURAI/
├── assets/             # Images, icons, and static visual resources (SVG logo)
├── css/
│   └── style.css       # Main application stylesheets and UI layout
├── js/
│   └── script.js       # Frontend logic, UI interactions, and AJAX calls
├── php/
│   ├── ai.php          # Groq API integration module (handles prompt formatting and cURL)
│   ├── config.php      # Configuration file (API keys and DB credentials template)
│   ├── data.php        # Central request handler acting as an API endpoint between FE and BE
│   └── db.php          # Database connection initialization using PDO/MySQLi
├── database.sql        # SQL dump containing database schema and table structure
└── index.html          # Application entry point (main dashboard interface)
