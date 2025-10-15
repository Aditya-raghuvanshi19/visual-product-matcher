<p align="center">
  <img src="./frontend/public/favicon.png" alt="Logo" width="100" height="100">
</p>

# Visual Product Matcher

### 🚀 Live Deployed Link
[https://visual-product-matcher-gamma.vercel.app/](https://visual-product-matcher-gamma.vercel.app/)

---


<div align="center">

**A full-stack, AI-driven visual search engine that identifies similar products from a catalog using deep learning embeddings.**

</div>

This project provides a robust, end-to-end system for visual product discovery. Users can upload an image of an item (e.g., a shirt, shoe, or handbag), and the application will instantly return a ranked list of the most visually similar products from a database.

The core of this system is a **deep learning model (MobileNet)** that converts images into high-dimensional vector embeddings. These embeddings capture the core visual features of each product, allowing for nuanced, content-based similarity comparisons far beyond what simple metadata tagging can achieve. The backend is powered by **Node.js/Express**, and the frontend is a responsive and interactive **React** application built with Vite.

---

### Key Features

- **Advanced Visual Search**: Leverages TensorFlow.js and the MobileNet architecture to generate deep learning embeddings for accurate similarity matching.
- **Dynamic Database Sync**: An automated script detects new or deleted product images and regenerates the embedding database to ensure perfect synchronization.
- **One-Click Admin Refresh**: A secure, token-protected API endpoint allows an administrator to trigger a full regeneration of all embeddings directly from the frontend UI.
- **Interactive React Frontend**: A clean, responsive interface featuring an image uploader, live search results, and a slider to filter matches by similarity score.
- **Self-Contained & Simple**: Requires no external database setup. Embeddings are stored in a local JSON file, and product images are served via Express static routes, making the project easy to run locally.

---

### System Architecture & Technology

| Layer        | Technology              | Purpose                                                                          |
| :----------- | :---------------------- | :------------------------------------------------------------------------------- |
| **Frontend** | React, Vite, Axios      | Provides a fast, modern user interface for image uploads and result visualization. |
| **Backend**  | Node.js, Express.js     | Serves the REST API, handles file uploads (with Multer), and manages core logic.   |
| **AI/ML Model**| TensorFlow.js (MobileNet) | Extracts 1024-dimension feature vectors (embeddings) from product images.          |
| **Data Storage**| JSON File System        | Stores product metadata and their corresponding embeddings in `db/products.json`.|

---
##  Project Structure

```
visual-product-matcher/
├── backend/
│   ├── db/
│   │   ├── products/               # Product images
│   │   └── products.json           # Database with embeddings
│   ├── routes/
│   │   └── imageRoutes.js          # /api/search + /api/refresh
│   ├── utils/
│   │   ├── similarity.js           # MobileNet + embedding utils
│   │   └── generateEmbeddings.js   # Auto-sync embeddings
│   ├── server.js                   # Express app entry
│   └── .env                        # Backend environment vars
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ResultsGrid.jsx
│   │   │   ├── SimilarResults.jsx
│   │   │   └── UploadCard.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
└── README.md

```

---

### Local Setup & Configuration

Follow these steps to get the project running on your local machine.

#### 1. Clone the Repository
git clone 
cd visual-product-matcher

text

#### 2. Backend Setup
cd backend
npm install

text
Create a `.env` file in `backend/`:
PORT=5000
FRONTEND_URL=http://localhost:5173
REFRESH_TOKEN=secret123

text

#### 3. Frontend Setup
cd ../frontend
npm install

text
Create a `.env` file in `frontend/`:
VITE_BACKEND_URL=http://localhost:5000

text

#### 4. Generate Embeddings
Place your product images in `backend/db/products/` and run the indexing script:
cd backend
node utils/generateEmbeddings.js

text

#### 5. Run the Application
Start the backend and frontend servers in separate terminals.
Terminal 1 (backend)
cd backend
npm start

Terminal 2 (frontend)
cd frontend
npm run dev

text
Open [**http://localhost:5173**](http://localhost:5173) in your browser.

---

### Author

**Aditya Raghuvanshi**


- **Email**: [raghuvanshiaditya1905@gmail.com](mailto:raghuvanshiaditya1905@gmail.com)
- **GitHub**: [Aditya Raghuvanshi](https://github.com/Aditya-raghuvanshi19)