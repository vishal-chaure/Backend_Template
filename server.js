import express from 'express';
import { testConnection, pool } from './database/db.js';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
// import diningPlaceRoutes from './routes/diningPlaceRoutes.js';
// import bookingRoutes from './routes/bookingRoutes.js';


dotenv.config();

// Create Express app
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', '*');
     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
     if (req.method === 'OPTIONS') {
          res.sendStatus(200);
     } else {
          next();
     }
});



// Root endpoint
app.get('/', (req, res) => {
     res.json({
          message: 'Zomato API is running!',
          status: 'success',
          timestamp: new Date().toISOString(),
          endpoints: {
               auth: '/api/users',
               dining_places: '/api/dining_places (coming soon)',
               bookings: '/api/bookings (coming soon)'
          }
     });
});

// Test database connection endpoint
app.get('/test-db', async (req, res) => {
     try {
          await testConnection();
          res.status(200).json({ message: 'Database connection successful' });
     } catch (error) {
          res.status(500).json({ message: 'Database connection failed', error: error.message });
     }
});

// Routes 
app.use('/api/users', userRoutes);
// app.use('/api/dining_places', diningPlaceRoutes);
// app.use('/api/bookings', bookingRoutes);




// 404 Route not found middleware
app.use('*', (req, res) => {
     res.status(404).json({ message: 'Route not found' });
});

// Global Error handling middleware
app.use((error, req, res, next) => {
     console.error("Error:", error);
     res.status(500).json({ message: 'Internal server error', error: error.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
     console.log(`🚀 Server is running on port ${PORT}`);
     console.log(`📱 API available at: http://localhost:${PORT}`);
     console.log(`🔗 Test endpoint: http://localhost:${PORT}/`);
     console.log(`👤 User endpoints: http://localhost:${PORT}/api/users`);
});

export default app;