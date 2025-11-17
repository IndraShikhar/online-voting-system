import express from 'express';

const voteRouter = express.Router();
import voteController from '../controllers/voteController.js';
import authMiddleware from '../middleware/authMiddleware.js';

voteRouter.use(authMiddleware.protect);

voteRouter.post('/cast', voteController.castVote);
voteRouter.get('/status/:electionId', voteController.hasUserVoted);
voteRouter.get('/results/:electionId', voteController.getCurrentResult);
voteRouter.get('/count/:electionId', voteController.totalVotesForAllCandidates);
// Calculate total voterTurnout
voteRouter.get('/turnout', voteController.getVoterTurnout);
voteRouter.get('/my-stats', voteController.getUserVotingStats);

// Admin routes
voteRouter.use(authMiddleware.restrictTo('admin'));
voteRouter.get('/by-election/:electionId', voteController.getVotesForElection);

export default voteRouter;
