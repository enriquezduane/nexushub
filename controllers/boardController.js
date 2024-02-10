const Board = require('../models/boardModel');

// Create a new board
exports.createBoard = async (req, res) => {
    try {
        const newBoard = await Board.create(req.body);
        res.status(201).json(newBoard);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all boards
exports.getAllBoards = async (req, res) => {
    try {
        const boards = await Board.find();
        res.json(boards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get board by ID
exports.getBoardById = async (req, res) => {
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
exports.updateBoardById = async (req, res) => {
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
exports.deleteBoardById = async (req, res) => {
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
