import express from "express"

const router = express.Router();
import voteController from "../controllers/voteController.js"


router.post('/cast', voteController.castVote);

router.get('/status/:electionId', voteController.hasUserVoted);

router.get('/results/:electionId', voteController.getCurrentResult);

router.get('/count/:electionId', voteController.totalVotesForAllCandidates);

export default router;