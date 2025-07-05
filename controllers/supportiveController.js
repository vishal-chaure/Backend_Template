import { pool } from '../database/db.js';


// pagination for dining places

const getAllDiningPlaces = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const offset = (page - 1) * limit;
          
          // Validate pagination parameters
          if (page < 1 || limit < 1) {
               return res.status(400).json({ 
                    message: "Page and limit must be positive numbers" 
               });
          }
          
          // Get total count
          const [countResult] = await pool.execute(
               "SELECT COUNT(*) as total FROM dining_places"
          );
          const total = countResult[0].total;
          
          // Get paginated data - use query for LIMIT/OFFSET
          const [diningPlaces] = await pool.query(
               "SELECT * FROM dining_places LIMIT ? OFFSET ?",
               [limit, offset]
          );
          
          const totalPages = Math.ceil(total / limit);
          
          res.status(200).json({
               message: "Dining places fetched successfully",
               data: diningPlaces,
               pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
               }
          });
     } catch (error) {
          res.status(500).json({
               message: "Internal server error in getAllDiningPlaces",
               error: error.message
          });
     }
}

export { getAllDiningPlaces };