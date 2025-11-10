import express from "express"
import candidateController from "../controllers/candidateController.js"

const router = express.Router();

router.get('/', candidateController.listAllCandidates);

router.get('/:id', candidateController.getDetailOfCandidate)

router.get('/by-election/:electionId', candidateController.getAllCandidates)

router.post('/add', candidateController.addNewCandidate)

router.put('/api/update/:id', candidateController.updateCandidate)

router.delete('/api/delete/:id', candidateController.deleteCandidate)

export default router;