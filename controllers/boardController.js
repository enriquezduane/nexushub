const Board = require('../models/boardModel');
const { populateBoard, populateBoards } = require('./helper');

// Create a new board
const createBoard = async (req, res) => {
    try {
        const newBoard = await Board.create(req.body);
        res.status(201).json(newBoard);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all boards
const getAllBoards = async (req, res) => {
    try {
        const boards = await Board.find();
        res.json(boards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get board by ID
const getBoardById = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update board by ID
const updateBoardById = async (req, res) => {
    try {
        const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.json(board);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete board by ID
const deleteBoardById = async (req, res) => {
    try {
        const board = await Board.findByIdAndDelete(req.params.id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.json({ message: 'Board deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getBoardByUrl = async (req, res, next) => {
    try {
        // Split the URL by slashes and get the last part
        const url = req.originalUrl;
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];

        // Replace "%20" with spaces
        const title = decodeURIComponent(lastPart.replace(/\+/g, ' '));

        // Find the board in the database
        const board = await Board.findOne({ title: { $regex: new RegExp(title, 'i') } });  

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        } else {
            res.board = await populateBoard(board);
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
    next();
}

module.exports = {
    createBoard,
    getAllBoards,
    getBoardById,
    updateBoardById,
    deleteBoardById,
    getBoardByUrl
}
