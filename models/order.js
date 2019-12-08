const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    amount: String,
    orderedAt: Date,
    status: {type: String, default: "pending"}
});