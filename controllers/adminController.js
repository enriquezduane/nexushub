const mongoose = require('mongoose');
const moment = require('moment-timezone');
const Category = require('../models/categoryModel');

const createCategory = async (req, res) => {
    try {
        const {title} = req.body;

        // check if category already exists
        const categoryExists = await Category.findOne({ title: title });

        if (categoryExists) {
            return res.status(409).json({ message: 'Category already exists' });
        }

        const category = new Category({
            _id: new mongoose.Types.ObjectId(),
            title: title,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        await category.save();
        
        res.status(201).json({message: 'Category created successfully'});
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createCategory,
}