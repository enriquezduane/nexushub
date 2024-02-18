const Board = require('../models/boardModel');
const { populateBoard } = require('./helper');

const renderBoard = (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('board', { 
            loggedIn: true, 
            title: res.board.title, 
            board: res.board, 
            posts: res.posts, 
            users: res.users, 
            forumRules: res.forumRules, 
            userLoggedIn: res.userLoggedIn
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
}

const getBoardByUrl = async (req, res, next) => {
    try {
        let board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        } else {
            board = await populateBoard(board);
        }

        res.board = board;
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
    next();
}

module.exports = {
    renderBoard,
    getBoardByUrl
}
