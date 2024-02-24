const { formatLatestPostDate } = require('../controllers/helper');

const renderIndex = (req, res) => {
    try {
        res.render('index', { 
            loggedIn: req.isAuthenticated(), 
            title: "NexusHub", 
            categories: res.categories, 
            boards: res.boards, 
            posts: res.posts, 
            users: res.users, 
            formatLatestPostDate, 
            forumRules: res.forumRules, 
            userLoggedIn: req.user
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
}

const renderTerms = (req, res) => {
    res.render('terms', { 
        loggedIn: req.isAuthenticated(), 
        title: "Terms and Conditions", 
        forumRules: 
        res.forumRules, 
        userLoggedIn: req.user 
    });
}

module.exports = {
    renderIndex,
    renderTerms
}