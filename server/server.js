import express from 'express';
import dotenv from 'dotenv';

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

//Different Routes Handler:
app.use('/api/candidates', CandidateRouter);
app.use('/api/users', userRoute);
app.use('/api/elections', electionsRoute);
app.use('/api/votes', votingRoute);

app.use(globalErrorHandler);
