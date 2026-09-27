import express from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/authRoutes.js';
import productRoute from './routes/productRoutes.js'; // 👈 1. പ്രൊഡക്റ്റ് റൂട്ട് ഇവിടെ import ചെയ്തു
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes

app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

// 📁 Routes Setting
app.use('/api/auth', authRoute); // Authentication routes
app.use('/api/products', productRoute); // 👈 2. പ്രൊഡക്റ്റ് റൂട്ട് ഇവിടെ ലിങ്ക് ചെയ്തു

// 🚨 Global Error Handler Middleware (എന്തെങ്കിലും എറർ വന്നാൽ അത് ഫ്രണ്ട് എൻഡിലേക്ക് കൃത്യമായി അയക്കാൻ)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// 🌐 Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then((response) => {
    console.log('MongoDB Connected Successfully! 🍃');
  })
  .catch((error) => {
    console.error('Connection Error:', error);
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});