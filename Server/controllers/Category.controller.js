const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createCategory = async(req , res) => {
    try{
        //fetch data
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are required !"
            });
        }

        //validation
        const categoryPresent = await Category.findOne({name});
        if(categoryPresent){
            return res.status(400).json({
                success: false,
                message: "Category already present !"
            });
        }

        //create entry in db 
        await Category.create({
            name: name, 
            description: description
        });

        //return response
        return res.status(200).json({
            success: true,
            message: "Category created successfully !"
        });
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.getAllCategory = async (req, res) => {
    try{
        const allCategory = await Category.find({}, {name: true, description: true}).populate("courses").exec();
        return res.status(200).json({
            success: true,
            message: "All Categories are returned successfully !",
            allCategory
        });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.categoryPageDetails = async (req, res) => {
    try{
        //get categoryId 
        const {categoryId} = req.body;

        //fetch courses for selected category
        const selectedCategory = await Category.findById(categoryId)
                                            .populate("courses")
                                            .exec();
        
        //validation
        if(!selectedCategory){
            return res.status(400).json({
                success: false,
                message:"Category not found !"
            });
        }

        //get courses for different categories
        const differentCategories = await Category.find({
                                                        _id: {$ne: categoryId},
                                                    })
                                                    .populate("courses")
                                                    .exec();

        //get top selling courses of the selected category
        const topCourses = await Course.aggregate([
            {
                $addFields: {
                    enrolledCount: { $size: "$studentEnrolled" }
                }
            },
            {
                $sort: { enrolledCount: -1 }
            },
            { $limit: 10 },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" }
        ]);


        //return res
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
                topCourses
            }
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}