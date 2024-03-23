const express = require('express');
const router = express.Router();

// router middlewares
router.use(express.static('public'));

// initialize database
const { headerFooterData } = require('../controllers/helper');

// import controller
const { 
    renderAdmin, createCategory, searchFilter, createBoard, createUser, createPost, createReply, 
    editCategory, editBoard, editUser, editPost, editReply, resolveReport,
    deleteCategory, deleteBoard, deleteUser, deletePost, deleteReply, deleteReport, unbanUser, getAdminPageItems
    } = require('../controllers/adminController');

router.get('/', getAdminPageItems, searchFilter, headerFooterData, renderAdmin);

router.route('/category')
    .post(createCategory)
    .patch(editCategory)
    .delete(deleteCategory);

router.route('/board')
    .post(createBoard)
    .patch(editBoard)
    .delete(deleteBoard);

router.route('/user')
    .post(createUser)
    .patch(editUser)
    .delete(deleteUser);

router.route('/post')
    .post(createPost)
    .patch(editPost)
    .delete(deletePost);

router.route('/reply')
    .post(createReply)
    .patch(editReply)
    .delete(deleteReply);

router.route('/report')
    .patch(resolveReport)
    .delete(deleteReport);

router.route('/banned')
    .patch(unbanUser)
    .delete(deleteUser);

module.exports = router;