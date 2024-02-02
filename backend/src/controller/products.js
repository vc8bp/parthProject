import Product from "../models/Product.js";
import { uploadImageToCloudinary } from "../utils/CloudinaryMethods.js"

export const addProduct = async () => {
    const id = mongoose.Types.ObjectId()
    try {
      const image = await uploadImageToCloudinary(req.body.img, id);
      req.body.img = image.url;
      const savedProduct = await Product.create({...req.body, _id: id})
      res.status(200).json(savedProduct);
    } catch (err) {
      if (err.name === "ValidationError") {
        if (err.name == 'ValidationError') {
          for (field in err.errors) {
            return res.status(400).json({sucess: false,message: err.errors[field].message}); 
          }
        }
      } 
      if(err.code === 11000){
        const dublicate = Object.keys(err.keyPattern)[0];
        return res.status(400).json({message: `A product already exist with the same ${dublicate}`}); 
      }
      return res.status(500).json({message: "internal server Error"});
    }
}

export const getProducts = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    const startIndex = (page - 1) * limit;
    const qCategory = req.query.category;
    const qsort = req.query.sort;
    const qColor = req.query.color;
    const qSize = req.query.size;
    const qs = req.query.s;

    try {
      let query = Product.find()

      const filterArr = [];
      if(qs) filterArr.push({$or: [
                            {"title": {$regex: qs, $options: "i"}},
                            {"productno": {$regex: qs, $options: "i"}},
                            {"desc": {$regex: qs, $options: "i"}},
                            {"categories": {$in: [qs]}}
                          ]})

      if (qCategory) filterArr.push({ categories: { $in: [qCategory] } });
      if (qColor) filterArr.push({ color: { $in: [qColor] } });
      if (qSize) filterArr.push({ size: { $in: [qSize] } }); 
      if (filterArr.length !== 0) {
          query = query.find({ $and: filterArr });
      }

      if(qsort === "Newest") { 
        query.sort({ createdAt: -1})
      } else if (qsort === "price-asc") {  
        query.sort({ price : 1})
      } else if (qsort === "price-desc") {
        query.sort({ price : -1})
      } else if (qsort === "toppurchased") {
        query.sort({ purchasedCount : -1})
      } else if (qsort === "topRated") {
        query.sort({ ratingsQuantity: -1, ratingsAverage : -1 })
      } else if (qsort === "topreviewed"){
        query.sort({ ratingsQuantity: -1 })
      }
      query.skip(startIndex).limit(limit)

      const products = await query.exec()

      
      res.status(200).json(products);
      
    } catch (error) {
      res.status(500).json({message: "failed to get Product" });
    }
}