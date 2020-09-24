const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must have a UserId"],
    },
    products: [
      Schema({
        quantity: { type: Number, default: 1 },
        item: {
          _id: { type: Schema.Types.ObjectId },
          title: String,
          price: Number,
        },
      }),
    ],
    totalPrice: { type: Number },
    
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
