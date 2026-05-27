# Cyber Hub Services - Full Stack Website 🚀

Welcome! Yeh "Cyber Hub Services" ki complete **Full-Stack (MERN)** React + Node.js application hai. Agar aapne folders se `node_modules` delete kar diya hai, toh niche diye steps ko follow karke isko apne laptop par chalayein aur **Hostinger** par host karein.

---

## 💻 1. Laptop Par Kaise Chalayein (Local Setup)

Sabse pehle check karein ki aapke laptop me **Node.js** aur **MongoDB** installed hai. 

### Step 1: Backend Setup
1. Apne terminal ya command prompt (CMD) ko open karein.
2. `backend` folder ke andar jayein:
   ```bash
   cd backend
   ```
3. Naye `node_modules` download karne ke liye command run karein:
   ```bash
   npm install
   ```
4. Seed data (Default Admin profile: `admin` / `adminpassword123` aur mock services/FAQs) database me load karne ke liye yeh run karein:
   ```bash
   npm run seed
   ```
5. Backend server ko start karein:
   ```bash
   npm start
   ```
   *Ab aapka backend api server `http://localhost:5000` par run hone lagega.*

---

### Step 2: Frontend Setup
1. Ek naya terminal tab open karein aur `frontend` folder me jayein:
   ```bash
   cd frontend
   ```
2. Naye `node_modules` download karne ke liye yeh command run karein (Lucide Icons compatibility ke liye `--legacy-peer-deps` lagana zaroori hai):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Frontend React website ko chalane ke liye yeh run karein:
   ```bash
   npm run dev
   ```
   *Website local port `http://localhost:5173` par live ho jayegi aur auto-connect ho jayegi!*

---

## 🌐 2. Hostinger Par Kaise Host Karein (VPS Hosting Guide)

Hostinger par full-stack Node.js + React app host karne ke liye aapko **Hostinger VPS (Virtual Private Server)** use karna hoga (kyunki simple Shared Web Hosting Node.js backend ko support nahi karti). Niche simple steps diye gaye hain:

### Step 1: MongoDB Online Setup (Atlas)
1. Free me account banayein [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Ek free database create karein aur uska connection string (`mongodb+srv://...`) copy kar lein.

### Step 2: VPS par files upload karein
1. Apne files (without `node_modules`) ko zip karke Hostinger VPS par upload karein FileZilla ya Git ke jariye.
2. `backend` folder ke andar `.env` file banayein aur usme online MongoDB Atlas ka connection string daalein:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

### Step 3: Backend ko background me start karein (PM2)
Hostinger VPS termial par login karke `backend` folder me jayein aur yeh run karein taky server hamesha chalta rahe:
```bash
# Node modules install karein
npm install

# Seed databases
npm run seed

# PM2 install karein aur start karein
npm install -g pm2
pm2 start server.js --name "cyberhub-backend"

# Server reboot hone par bhi automatic start hone ke liye:
pm2 startup
pm2 save
```

### Step 4: Frontend Build banana aur Serve karna
1. Frontend folder me `vite.config.js` check karein proxy settings ke liye.
2. Build command run karein:
   ```bash
   npm install --legacy-peer-deps
   npm run build
   ```
3. Yeh process ek `dist` folder generate karegi. Is `dist` folder ke items ko Hostinger par public HTML directory me upload kar dein ya **Nginx** ke jariye point kar dein.

---

## 🔑 Admin Default Credentials
* **Username:** `admin`
* **Password:** `adminpassword123`
* **Secure Link:** `http://your-domain.com/admin/login`

Aap panel me login karke dynamic addresses aur telephone numbers dynamically change kar sakte hain! 

Koi bhi dikt aaye toh local port standard configurations check karein. Enjoy building! 🎉
