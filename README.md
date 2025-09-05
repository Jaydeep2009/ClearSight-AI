# ClearSight AI  

ClearSight AI is a **GenAI + MERN-powered business automation platform** that helps companies make sense of messy, unstructured data (Excel sheets, PDFs, logs, etc.).  
Users can upload documents, and the system will process them with AI to extract insights, generate summaries, and provide structured results.  

---

## 🚀 Features
- 🔐 User Authentication (Signup/Login with JWT)  
- 📂 Secure file upload (planned)  
- 🤖 Generative AI integration (planned)  
- 📊 Data visualization dashboard (planned)  
- 🌐 RESTful API backend  

---

## 🛠 Tech Stack
- **Frontend**: React.js (to be added)  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: JWT + bcrypt  
- **Environment**: dotenv  

---

## 📂 Folder Structure
ClearSight-AI/
│
├── backend/ # Backend code (Express + MongoDB)
│ ├── src/
│ │ ├── controllers/ # Request handlers
│ │ ├── models/ # Database models
│ │ ├── routes/ # API routes
│ │ ├── app.js # Express app
│ │ └── server.js # Server entry point
│ ├── package.json
│ └── .env (ignored)
│
├── frontend/ # (To be added later)
│
├── .gitignore
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/ClearSight-AI.git
cd ClearSight-AI/backend

2. Install dependencies
npm install

3. Setup environment variables

Create a .env file inside backend/ with:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4. Run the backend server
npm run dev   # with nodemon
# or
node src/server.js


Server will run at:
👉 http://localhost:5000

📡 API Endpoints
Authentication Routes

POST /api/auth/signup → Register new user

POST /api/auth/login → Login user

Sample response:

{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

🔮 Roadmap

 Setup backend with authentication

 Add file upload API

 Integrate Generative AI for analysis

 Build React frontend

 Add charts & dashboard

👨‍💻 Author

Jaydeep Gaikwad

🌐 Portfolio (to be added)

💼 LinkedIn

🐙 GitHub

📜 License

This project is licensed under the MIT License – feel free to use and modify.

