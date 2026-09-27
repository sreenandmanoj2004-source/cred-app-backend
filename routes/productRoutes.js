import express from 'express';
import { 
  addProduct, 
  getAllProducts, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';

// 🔒 helpers ഫോൾഡറിൽ നിന്ന് അഡ്മിൻ മിഡിൽവെയർ ഇംപോർട്ട് ചെയ്യുന്നു
import { verifyToken } from '../helpers/authMiddleware.js';

const productRoute = express.Router();

// 1. പ്രൊഡക്റ്റ് ആഡ് ചെയ്യാൻ (ലോഗിൻ ചെയ്ത അഡ്മിന് മാത്രം - Protected)
productRoute.post('/', verifyToken, addProduct);          // POST http://localhost:5000/api/products

// 2. എല്ലാ പ്രൊഡക്റ്റും കാണാൻ (എല്ലാവർക്കും കാണാം - Public)
productRoute.get('/', getAllProducts);       // GET http://localhost:5000/api/products

// 3. പ്രൊഡക്റ്റ് അപ്ഡേറ്റ് ചെയ്യാൻ (ലോഗിൻ ചെയ്ത അഡ്മിന് മാത്രം - Protected)
productRoute.put('/:id', verifyToken, updateProduct);     // PUT http://localhost:5000/api/products/:id

// 4. പ്രൊഡക്റ്റ് ഡിലീറ്റ് ചെയ്യാൻ (ലോഗിൻ ചെയ്ത അഡ്മിന് മാത്രം - Protected)
productRoute.delete('/:id', verifyToken, deleteProduct);  // DELETE http://localhost:5000/api/products/:id

export default productRoute;