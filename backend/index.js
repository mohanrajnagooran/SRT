import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './config/db.js';
import customerRoutes from './routes/customerRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import lrRoutes from './routes/lrRoutes.js';
import authRoutes from './routes/authRoutes.js';
import routePrefixRoutes from './routes/routePrefixRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import travelRoutes from './routes/travelRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db.connect().then(() => {
//   console.log('Database connected successfully');
  
// }).catch(err => {
//   console.error('Database connection failed:', err);
// });

// Test DB connection
app.get('/testdb', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');

    res.json({
      message: '✅ MySQL connected successfully',
      solution: rows[0].solution
    });
  } catch (err) {
    console.error('❌ Test DB Error:', err);

    res.status(500).json({
      error: {
        message: err.message || 'Unknown error',
        code: err.code || 'NO_CODE',
        stack: err.stack || 'No stack trace'
      }
    });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// app.use((req, res, next) => {
//   console.log("➡️ Request:", req.method, req.originalUrl);
//   next();
// });

// cutomer routes
app.use('/api/customers', customerRoutes);

// place routes
app.use('/api/places', placeRoutes);

// article routes
app.use('/api/articles', articleRoutes);

// lr routes
app.use('/api/lrs', lrRoutes);

// auth routes
app.use('/api/auth', authRoutes);

// route prefix routes
app.use('/api/route-prefix', routePrefixRoutes);

// transaction  routes
app.use('/api/transactions', transactionRoutes);
// travel routes
app.use('/api/travel', travelRoutes);
// driver routes
app.use('/api/drivers', driverRoutes);
// vehicle routes
app.use('/api/vehicles', vehicleRoutes);

// // elecron
// app.get('/api/print-lorry-receipt/:id', (req, res) => {
//   const sampleData = {
//     fromName: 'Chennai',
//     toName: 'Madurai',
//     articles: ['Rice', 'Sugar'],
//     total: 4200
//   };

//   res.json(sampleData); // Replace with real DB fetch later
// });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});