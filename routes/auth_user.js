import express from "express";
import User from "../models/User.js";
import Book from "../models/Book.js";
import protect from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (username === '' && password === '') {
        res.status(400).json({ error: "Invalid username and password" });
    } else {
        const isUserExist = await User.findOne({ username });

        if (isUserExist && password === isUserExist.password) {
            try {
                const token = jwt.sign({ userId: isUserExist._id }, process.env.JWT_SECRET, {
                    expiresIn: '1d'
                });
    
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000
                });
    
                res.status(201).json({
                    id: isUserExist._id,
                    username: isUserExist.username
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            res.status(400).json({ error: "Invalid data" });
        }
    }
});

router.put("/review/:bookId", protect, async (req, res) => {
    const bookId = req.params.bookId;
    const review = req.body;

    try {
        const book = await Book.findById(bookId);
        book.reviews.push(review);
        await book.save();

        res.status(200).json({ message: "review added successfully "});
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


router.delete("/review/:bookId", protect, async (req, res) => {
    const bookId = req.params.bookId;

    try {
        const book = await Book.findByIdAndUpdate(bookId, { $set: { reviews: [] } });

        res.status(200).json({ message: "successfully remove reviews post by the user "});
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


export default router;