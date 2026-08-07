const Category = require('../models/categoryModel');

// @desc    Create a new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating category' });
  }
};

// @desc    Get all categories
// @route   GET /api/categories (we'll expose to both admin and students)
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    category.name = name || category.name;
    category.description = description !== undefined ? description : category.description;
    
    const updated = await category.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating category' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    await category.deleteOne();
    res.status(200).json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting category' });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
};
