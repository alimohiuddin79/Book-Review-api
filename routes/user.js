import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Book from "../models/Book.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const books = await Book.find({});
    if (books) {
        res.status(200).json(books);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

router.get("/bookId/:id", async (req, res) => {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

router.get("/author/:author", async (req, res) => {
    const author = req.params.author;
    console.log(author);

    const book = await Book.find({ author: author });

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

router.get("/title/:title", async (req, res) => {
    const title = req.params.title;

    const book = await Book.find({ title: title });

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

router.get("/review/:bookId", async (req, res) => {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);

    if (book) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (username !== '' && password !== '') {
        try {
            const newUser = await User.create({
                username: username,
                password: password
            })

            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            res.status(201).json({
                id: newUser._id,
                username: newUser.username
            });
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(400).json({ error: "Incorrect username and password" });
    }
});



export default router;