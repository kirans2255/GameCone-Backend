const Admin = require('../model/Admin');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary')
const Categorys = require('../model/Category')
const User = require('../model/User')
const Product = require('../model/Product')

require('dotenv').config();

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminUser = await Admin.findOne({ email });
    console.log("Admin:", adminUser);

    if (!adminUser) {
      return res.status(404).json({ error: "Admin Not Found" });
    }

    if (password !== adminUser.password) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    const token = jwt.sign(
      {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


////Category
const Category = async (req, res) => {
  try {
    const { CategoryName } = req.body;
    console.log("suahil :",req.body);


    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const desiredWidth = 300;
    const desiredHeight = 200;

    const result = await cloudinary.uploader.upload(req.files[0].path, {
      width: desiredWidth,
      height: desiredHeight,
      crop: 'scale',
      quality: 'auto',
      fetch_format: 'auto'
    });


    const newCategory = new Categorys({
      CategoryName: CategoryName,
      CategoryImage: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await newCategory.save();
    res.status(201).json({ success: true, category: newCategory });
  } catch (error) {
    console.error('Error adding Category:', error);
    res.status(500).json({ error: 'Error adding the Category' });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Categorys.find();
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Error fetching category' });
  }
};


const deleteCategory = async (req, res) => {

  const CategoryID = req.params.id;
  console.log(CategoryID);

  try {
    const categorys = await Categorys.findByIdAndDelete(CategoryID);
    if (!categorys) {
      return res.status(404).json({ error: 'Category Not Found' })
    }

    res.status(201).json({ message: 'Category Deleted', categorys })
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Error deleting category' });
  }
}


const editCategory = async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const CategoryId = req.params.id;

    // console.log("sdf:", CategoryId);

    const CategoryName = req.body.CategoryName;

    // console.log("sdsadasf:", CategoryName);

    if (!CategoryName) {
      return res.status(400).json({ error: 'CategoryName is required' });
    }

    // Find the category by ID
    const Category = await Categorys.findById(CategoryId);

    if (!Category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if files are uploaded
    if (req.files && req.files.length > 0) {
      const desiredWidth = 300;
      const desiredHeight = 200;

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.files[0].path, {
        width: desiredWidth,
        height: desiredHeight,
        crop: 'scale',
      });      

      // Remove old image from Cloudinary if it exists
      if (Category.CategoryImage && Category.CategoryImage.public_id) {
        await cloudinary.uploader.destroy(Category.CategoryImage.public_id);
      }

      // Update CategoryImage field
      Category.CategoryImage = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    Category.CategoryName = CategoryName;

    await Category.save();
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating Category:', error);
    res.status(500).json({ error: 'Error updating Category' });
  }
};


const renderUser = async function (req, res) {
  try {
    const user = await User.find();

    res.json({ user });
  } catch (error) {
    console.error('Error fetching User:', error);
    res.status(500).json({ error: 'Error fetching User' });
  }
};

const toggleBlock = async function (req, res) {
  try {
    const userId = req.body.values;

    console.log("User:", req.body);

    // Find user by ID
    const user = await User.findById(userId);
    console.log("hello:", user);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Toggle block status
    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error('Error toggling block status:', error);
    return res.status(500).json({ success: false, error: 'Error toggling block status' });
  }
};


const addProduct = async (req, res) => {
  try {
    const { name ,price ,edition ,category} = req.body;
    console.log("suahil :",req.body);


    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const desiredWidth = 300;
    const desiredHeight = 200;

    const result = await cloudinary.uploader.upload(req.files[0].path, {
      width: desiredWidth,
      height: desiredHeight,
      crop: 'scale',
      quality: 'auto',
      fetch_format: 'auto'
    });


    const newProduct = new Product({
      name: name,
      price: price,
      edition: edition,
      category: category,
      images : {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error adding Product:', error);
    res.status(500).json({ error: 'Error adding the Product' });
  }
};


const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    const Category = await Categorys.find();
    res.json({ products , Category });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Error fetching category' });
  }
};

const deleteProduct = async (req, res) => {

  const productID = req.params.id;
  console.log(productID);

  try {
    const products = await Product.findByIdAndDelete(productID);
    if (!products) {
      return res.status(404).json({ error: 'Product Not Found' })
    }

    res.status(201).json({ message: 'Product Deleted', products })
  } catch (error) {
    console.error('Error deleting Product:', error);
    res.status(500).json({ error: 'Error deleting Product' });
  }
}

const editProduct = async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const productId = req.params.id;

    console.log("id:", productId);

    const name = req.body.name;
    const price = req.body.price;
    const edition = req.body.edition;
    const category = req.body.category;

    console.log("name:", name);

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'product not found' });
    }

    // Check if files are uploaded
    if (req.files && req.files.length > 0) {
      const desiredWidth = 300;
      const desiredHeight = 200;

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.files[0].path, {
        width: desiredWidth,
        height: desiredHeight,
        crop: 'scale',
      });      

      // Remove old image from Cloudinary if it exists
      if (product.images && product.images.public_id) {
        await cloudinary.uploader.destroy(product.images.public_id);
      }

      // Update productImage field
      product.images = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    product.name = name;
    product.price = price;
    product.edition = edition;
    product.category = category;


    await product.save();
    res.json({ message: 'product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
};


module.exports = {
  Login,
  Category,
  getCategory,
  deleteCategory,
  editCategory,
  renderUser,
  toggleBlock,
  addProduct,
  getProduct,
  deleteProduct,
  editProduct
};
