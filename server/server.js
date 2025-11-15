import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//Route Handler import:
import CandidateRouter from './routes/candidateRoutes.js';
import userRoute from './routes/userRoutes.js';
import electionsRoute from './routes/electionRoutes.js';
import votingRoute from './routes/voteRoutes.js';

// Error Handler import:
import globalErrorHandler from './controllers/errorController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow session cookies to be sent
};

app.use(cors(corsOptions));
// Note: don't call `app.options('*', ...)` with a bare '*' string
// because some path-to-regexp versions treat '*' as an invalid
// parameter pattern and throw. `app.use(cors(...))` above is sufficient
// to handle preflight CORS for all routes in this app.

//Different Routes Handler:
app.use('/api/candidates', CandidateRouter);
app.use('/api/users', userRoute);
app.use('/api/elections', electionsRoute);
app.use('/api/votes', votingRoute);

app.use(globalErrorHandler);
