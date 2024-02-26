const mongoose = require('mongoose');
const Post = require('../models/postModel');
const Reply = require('../models/replyModel');
const User = require('../models/userModel');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const { populatePost, populateReply, emoticonData, handleValidationError } = require('./helper');

const renderCreatePost = (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(403).json({ message: 'User not logged in' });
        }

        res.render('createPost', { 
            loggedIn: req.isAuthenticated(),
            title: 'Create Post', 
            forumRules: res.forumRules, 
            userLoggedIn: req.user 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
}

const renderPost = (req, res) => {
    try {
        // Render the dynamic boards pages with the fetched data
        res.render('post', { 
            loggedIn: req.isAuthenticated(),
            title: res.post.title, 
            post: res.post,
            replies: res.paginationResults,
            page: res.page,
            totalPages: res.totalPages,
            users: res.users, 
            forumRules: res.forumRules, 
            userLoggedIn: req.user 
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: err.message, post: res.post});
    }
}

// Get post by URL
const getPostByUrl = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found', post: post });
        } else {
            res.post = await populatePost(post);
        }
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Increment views
const incrementViews = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(req.params.id);

        // Check if the cookie exists
        if (!req.cookies[`viewed_${id}`]) {
            // Increment the view count
            post.views += 1;
            await post.save();

            // Set a cookie to expire in desired time in milliseconds (CURRENT: 1 minute)
            res.cookie(`viewed_${id}`, true, { maxAge: 1000 * 60 * 60 });
        }
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
    
};

const getPagination = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; 

    let startIndex = (page - 1) * limit;
    let endIndex = startIndex + limit;

    try {
        const post = res.post;

        // Include the post itself in the replies array
        const allReplies = [post].concat(post.replies);

        const totalPages = Math.ceil(allReplies.length / limit);

        const results = allReplies.slice(startIndex, endIndex);

        const repliesOnly = results.filter(item => item.id !== post.id);

        res.post = post;
        res.paginationResults = repliesOnly;
        res.totalPages = totalPages;
        res.page = page;
        next();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
}

const createPost = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(403).json({ message: 'User not logged in.' });
        }

        const { title, content, boardId } = req.body;

        const isEmptyContent = content.ops.every(op => {
            // Skip the check if the insert is an image
            if (op.insert && typeof op.insert === 'object' && op.insert.image) {
                return false;
            }
        
            // Check if op.insert is a string before attempting to trim
            if (typeof op.insert === 'string') {
                // Remove leading and trailing whitespace from the insert
                const trimmedInsert = op.insert.trim();
                // Check if the trimmed insert is only newline characters
                return trimmedInsert === '\n' || trimmedInsert === '';
            }
            
            // If op.insert is not a string, consider it as empty
            return true;
        });

        if (isEmptyContent) {
            return res.status(400).json({ message: 'Post content is empty!' });
        }

        const opsWithEmoticons = content.ops.map(op => {
            if (op.insert && typeof op.insert === 'object') {
                const emoticonType = Object.keys(op.insert)[0];
                if (emoticonData[emoticonType]) {
                    return { insert: { image: emoticonData[emoticonType] } };
                }
            }
            return op;
        });

        // Replace emoticon ops with image ops in content
        converter = new QuillDeltaToHtmlConverter(opsWithEmoticons, {});

        const htmlContent = converter.convert();
        const safeHtmlContent = htmlContent.replace(/src="unsafe:(.*?)"/g, 'src="$1"');

        const user = await User.findById(req.user.id); 

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Create a new post
        const initialPost = new Post({
            _id: new mongoose.Types.ObjectId(),
            title: title,
            refBoard: boardId,
            content: safeHtmlContent,
            poster: user.id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        // Save the new post
        const post = await initialPost.save();

        // send the post id to the client
        res.status(200).json({ id: post.id });
    } catch (err) {
        console.error('Error:', err);
        const { status, message } = handleValidationError(err);
        return res.status(status).json({ message });
    }
}


// Create a new reply
const createReply = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(403).json({ message: 'User not logged in.' });
        }

        const { content, postId } = req.body;

        const isEmptyContent = content.ops.every(op => {
            // Check if op.insert is a string before attempting to trim
            if (typeof op.insert === 'string') {
                // Remove leading and trailing whitespace from the insert
                const trimmedInsert = op.insert.trim();
                // Check if the trimmed insert is only newline characters
                return trimmedInsert === '\n' || trimmedInsert === '';
            }
        });

        if (isEmptyContent) {
            return res.status(400).json({ message: 'Reply content is empty!' });
        }
        
        const opsWithEmoticons = content.ops.map(op => {
            if (op.insert && typeof op.insert === 'object') {
                const emoticonType = Object.keys(op.insert)[0];
                if (emoticonData[emoticonType]) {
                    return { insert: { image: emoticonData[emoticonType] } };
                }
            }
            return op;
        });

        // Replace emoticon ops with image ops in content
        converter = new QuillDeltaToHtmlConverter(opsWithEmoticons, {});

        const htmlContent = converter.convert();
        const safeHtmlContent = htmlContent.replace(/src="unsafe:(.*?)"/g, 'src="$1"');
        
        // Find the post and user by its ID
        const initialPost = await Post.findById(postId);

        if (!initialPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Populate the post object
        const post = await populatePost(initialPost);
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new reply
        const initialReply = new Reply({
            _id: new mongoose.Types.ObjectId(),
            title: 'Re: ' + post.title,
            refPost: post.id,
            poster: user.id,
            reply: safeHtmlContent,
            createdAt: Date.now(),
            updatedAt: Date.now() 
        });

        // save the new reply
        const reply = await initialReply.save();

        // populate the new reply object
        populatedReply = await populateReply(reply);

        replyMsg = {
            id: populatedReply.id,
            userId: populatedReply.poster.id,
            href: populatedReply.refPost.href,
            title: populatedReply.title,
            reply: populatedReply.reply,
            date: populatedReply.createdAtSGT,
            username: populatedReply.poster.username,
            joinDate: populatedReply.poster.joinDateMonth,
            role: populatedReply.poster.role,
            roleClass: populatedReply.poster.roleClass,
            postCount: populatedReply.poster.postCount,
            edited: populatedReply.edited,
            updatedAtSGT: populatedReply.updatedAtSGT
        }

        // Send the new reply object to the client
        res.status(200).json(replyMsg);
    } catch (err) {
        console.error('Error:', err);
        const { status, message } = handleValidationError(err);
        return res.status(status).json({ message });
    }
};

// Delete reply
const deleteContent = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(403).json({ message: 'User is not logged in!' });
        }

        const { type, id } = req.body;
        const userId = req.user.id;

        if (type === 'post') {

            // Find the post
            const post = await Post.findById(id);

            if (!post) {
                return res.status(404).json({ message: 'Post not found!' });
            }

            if (post.poster.toString() !== userId) {
                return res.status(403).json({ message: 'Unauthorized to delete!' });
            }

            // Delete the post
            await post.deleteOne();

            res.status(200).json({ message: 'Post deleted successfully!' });
        } else {

            // Find the reply
            const reply = await Reply.findById(id);

            if (!reply) {
                return res.status(404).json({ message: 'Reply not found!' });
            }

            if (reply.poster.toString() !== userId) {
                return res.status(403).json({ message: 'Unauthorized to delete!' });
            }

            // Delete the reply
            await reply.deleteOne();
            
            res.status(200).json({ message: 'Reply deleted successfully!' });
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const updateContent = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(403).json({ message: 'User is not logged in!' });
        }

        const { type, id, content } = req.body;
        const userId = req.user.id;

        const trimmedContent = content.replace(/<(?!img)[^>]*>/g, '').trim();
        if (trimmedContent === '' || trimmedContent === '<br>') {
            return res.status(400).json({ message: 'Content is empty!' });
        }

        if (type === 'post') {

            // Find the post
            const post = await Post.findById(id);

            if (!post) {
                return res.status(404).json({ message: 'Post not found!' });
            }

            if (post.poster.toString() !== userId) {
                return res.status(403).json({ message: 'Unauthorized editing!' });
            }

            // Update the post
            post.content = content;
            post.updatedAt = Date.now();
            await post.save();

            res.status(200).json({ updatedAt: post.updatedAtSGT });
        } else {

            // Find the reply
            const reply = await Reply.findById(id);

            if (!reply) {
                return res.status(404).json({ message: 'Reply not found!' });
            }

            if (reply.poster.toString() !== userId) {
                return res.status(403).json({ message: 'Unauthorized editing!' });
            }

            // Update the reply
            reply.reply = content;
            reply.updatedAt = Date.now();
            await reply.save();

            res.status(200).json({ updatedAt: reply.updatedAtSGT });
        }
    } catch (error) {
        console.error('Error:', err);
        const { status, message } = handleValidationError(err);
        return res.status(status).json({ message });
    }
};

const addVoteToUser = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(403).json({ message: 'User not logged in.' });
        }

        const { action, type, id, active } = req.body;

        // Find the user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the type is post or reply
        if (type === 'post') {
            if (action === 'upvote') {
                if (active) {
                    // If not already upvoted, add to upvoted array
                    if (!user.upvoted.some(vote => vote.item.toString() === id)) {
                        user.upvoted.push({ itemType: 'Post', item: id });
                    }

                    if (user.downvoted.some(vote => vote.item.toString() === id)) {
                        // Remove from downvoted array
                        user.downvoted = user.downvoted.filter(vote => vote.item.toString() !== id);
                    }
                } else {
                    // Remove from upvoted array
                    user.upvoted = user.upvoted.filter(vote => vote.item.toString() !== id);

                    // Remove from downvoted array
                    user.downvoted = user.downvoted.filter(vote => vote.item.toString() !== id);
                }
            } else if (action === 'downvote') {
                if (active) {
                    // If not already downvoted, add to downvoted array
                    if (!user.downvoted.some(vote => vote.item.toString() === id)) {
                        user.downvoted.push({ itemType: 'Post', item: id });
                    }

                    if (user.upvoted.some(vote => vote.item.toString() === id)) {
                        // Remove from upvoted array
                        user.upvoted = user.upvoted.filter(vote => vote.item.toString() !== id);
                    }
                } else {
                    // Remove from downvoted array
                    user.downvoted = user.downvoted.filter(vote => vote.item.toString() !== id);

                    // Remove from upvoted array
                    user.upvoted = user.upvoted.filter(vote => vote.item.toString() !== id);
                }
            }
        } else if (type === 'reply') {
            if (action === 'upvote') {
                if (active) {
                    // If not already upvoted, add to upvoted array
                    if (!user.upvoted.some(vote => vote.item.toString() === id)) {
                        user.upvoted.push({ itemType: 'Reply', item: id });
                    }

                    if (user.downvoted.some(vote => vote.item.toString() === id)) {
                        // Remove from downvoted array
                        user.downvoted = user.downvoted.filter(vote => vote.item.toString() !== id);
                    }
                } else {
                    // Remove from upvoted array
                    user.upvoted = user.upvoted.filter(vote => vote.item.toString() !== id);

                    // Remove from downvoted array
                    user.downvoted = user.downvoted.filter(vote => vote.item.toString() !== id);
                }
            } else if (action === 'downvote') {
                if (active) {
                    // If not already downvoted, add to downvoted array
                    if (!user.downvoted.some(vote => vote.item.toString() === id)) {
                        user.downvoted.push({ itemType: 'Reply', item: id });
                    }

                    if (user.upvoted.some(vote => vote.item.toString() === id)) {
                        // Remove from upvoted array
                        user.upvoted = user.upvoted.filter(vote => vote.item.toString() !== id);
                    }
                } else {
                    // Remove from downvoted array
                    user.downvoted = user.downvoted.filter(vote => vote.item.toString() !== id);

                    // Remove from upvoted array
                    user.upvoted = user.upvoted.filter(vote => vote.item.toString() !== id);
                }
            }
        } else {
            return res.status(400).json({ message: 'Invalid type' });
        }

        // Save the updated user
        await user.save();

        next();
    } catch (error) {
        console.error('Error adding vote to user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const upvote = async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(403).json({ message: 'User not logged in.' });
        }

        const {type, id, count } = req.body;

        if (type === 'post') {
            // Find the post
            const post = await Post.findById(id);

            // Update the post
            post.upvotes = count;
            await post.save();
        } else {
            // Find the reply
            const reply = await Reply.findById(id);

            // Update the reply
            reply.upvotes = count;
            await reply.save();
        }

        // Send a success response
        res.status(200).json({ message: 'Upvoted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    renderCreatePost,
    renderPost,
    getPostByUrl,
    incrementViews,
    getPagination,
    createPost,
    createReply,
    deleteContent,
    updateContent,
    addVoteToUser,
    upvote,
};
