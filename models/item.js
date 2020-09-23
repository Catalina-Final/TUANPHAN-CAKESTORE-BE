const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    price: { type: Number, require: true },
    imgSrc:{type:String, required: false},  
    // images: [String],
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

itemSchema.plugin(require("./plugins/isDeletedFalse"));

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
