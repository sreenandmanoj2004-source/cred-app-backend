import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // ഏത് യൂസർ ആണ് പ്രൊഡക്റ്റ് ആഡ് ചെയ്തത് എന്ന് ട്രാക്ക് ചെയ്യാൻ (Optional but good)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);