import express from 'express';

const voteRouter = express.Router();
import voteController from '../controllers/voteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

voteRouter.use(authMiddleware.protect);

voteRouter.post('/cast', voteController.castVote);
voteRouter.get('/status/:electionId', voteController.hasUserVoted);
voteRouter.get('/results/:electionId', voteController.getCurrentResult);
voteRouter.get('/count/:electionId', voteController.totalVotesForAllCandidates);
export default voteRouter;
