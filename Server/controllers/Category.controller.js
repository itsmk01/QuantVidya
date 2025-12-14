const { data } = require("react-router-dom");
const Category = require("../models/Category");
const Course = require("../models/Course");

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.createCategory = async (req, res) => {
  try {
    //fetch data
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required !",
      });
    }

    //validation
    const categoryPresent = await Category.findOne({ name });
    if (categoryPresent) {
      return res.status(400).json({
        success: false,
        message: "Category already present !",
      });
    }

    //create entry in db
    await Category.create({
      name: name,
      description: description,
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "Category created successfully !",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const allCategoryDetails = await Category.find(
      {},
      { name: true, description: true }
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "instructor", populate: { path: "additionalDetails" } },
          { path: "ratingAndReviews" },
          { path: "category", select: "name" },
        ],
      })
      .exec();

    // Top selling courses overall
    const topCourses = await Course.aggregate([
      {
        $addFields: {
          enrolledCount: { $size: "$studentEnrolled" },
        },
      },
      { $sort: { enrolledCount: -1 } },
      { $limit: 10 },

      // Category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // Instructor
      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      { $unwind: "$instructor" },

      // Instructor additionalDetails
      {
        $lookup: {
          from: "profiles",
          localField: "instructor.additionalDetails",
          foreignField: "_id",
          as: "instructor.additionalDetails",
        },
      },
      { $unwind: "$instructor.additionalDetails" },

      // Ratings
      {
        $lookup: {
          from: "ratingandreviews",
          localField: "ratingAndReviews",
          foreignField: "_id",
          as: "ratingAndReviews",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "All Categories are returned successfully !",
      allCategoryDetails,
      topCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    // Get categoryName from req.body
    const { categoryName } = req.body;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "categoryName is required",
      });
    }

    // Convert slug -> name  (data-science -> Data Science)
    const formattedName = categoryName.replace(/-/g, " ");
    const safeName = escapeRegex(formattedName);

    // Fetch selected category by name (case insensitive)
    const selectedCategory = await Category.findOne({
      name: { $regex: "^" + safeName + "$", $options: "i" },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "instructor", populate: { path: "additionalDetails" } },
          { path: "ratingAndReviews" },
          { path: "category", select: "name" },
        ],
      })
      .exec();

    // Validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found!",
      });
    }

    // Get courses for different categories (excluding selected one)
    const differentCategories = await Category.find({
      _id: { $ne: selectedCategory._id },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();

    // Top selling courses overall
    const topCourses = await Course.aggregate([
      {
        $addFields: {
          enrolledCount: { $size: "$studentEnrolled" },
        },
      },
      { $sort: { enrolledCount: -1 } },
      { $limit: 10 },

      // Category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      // Instructor
      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "instructor",
        },
      },
      { $unwind: "$instructor" },

      // Instructor additionalDetails
      {
        $lookup: {
          from: "profiles",
          localField: "instructor.additionalDetails",
          foreignField: "_id",
          as: "instructor.additionalDetails",
        },
      },
      { $unwind: "$instructor.additionalDetails" },

      // Ratings
      {
        $lookup: {
          from: "ratingandreviews",
          localField: "ratingAndReviews",
          foreignField: "_id",
          as: "ratingAndReviews",
        },
      },
    ]);

    // Return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
        topCourses,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
