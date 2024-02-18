const { formatLatestPostDate } = require('../controllers/helper');

const renderIndex = (req, res) => {
    try {
        res.render('index', { 
            loggedIn: false, 
            title: "NexusHub", 
            categories: res.categories, 
            boards: res.boards, 
            posts: res.posts, 
            users: res.users, 
            formatLatestPostDate, 
            forumRules: res.forumRules, 
            userLoggedIn: res.userLoggedIn
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message });
    }
}

const renderTerms = (req, res) => {
    res.render('terms', { 
        loggedIn: true, 
        title: "Terms and Conditions", 
        forumRules: 
        res.forumRules, 
        userLoggedIn: res.userLoggedIn 
    });
}

module.exports = {
    renderIndex,
    renderTerms
}