import express from "express"

const voteRouter = express.Router();
import voteController from "../controllers/voteController.js"


voteRouter.post('/cast', voteController.castVote);

voteRouter.get('/status/:electionId', voteController.hasUserVoted);

voteRouter.get('/results/:electionId', voteController.getCurrentResult);

voteRouter.get('/count/:electionId', voteController.totalVotesForAllCandidates);

export default voteRouter;