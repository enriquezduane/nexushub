const Board = require('../models/boardModel');
const { populateBoard } = require('./helper');

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
    getBoardByUrl
}
