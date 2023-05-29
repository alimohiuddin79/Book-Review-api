import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    author: String,
    title: String,
    reviews: [],
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
