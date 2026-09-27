import HttpError from "../helpers/httpError.js";
import { Product } from "../models/product.js";

// ➕ 1. ADD NEW PRODUCT (CREATE)
export const addProduct = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price || !description) {
      return next(new HttpError("All fields are required", 400));
    }

    const newProduct = new Product({
      name,
      price,
      description,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

// 🔍 2. GET ALL PRODUCTS (READ)
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // പുതിയത് ആദ്യം വരാൻ

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

// ⚡ 3. UPDATE PRODUCT (UPDATE)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true, runValidators: true } // പുതിയ ഡാറ്റ റിട്ടേൺ ചെയ്യാൻ
    );

    if (!updatedProduct) {
      return next(new HttpError("Product not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};

// 🗑️ 4. DELETE PRODUCT (DELETE)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return next(new HttpError("Product not found", 404));
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(new HttpError(error.message || "Internal Server Error", 500));
  }
};