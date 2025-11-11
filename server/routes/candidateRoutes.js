import express from "express"
import candidateController from "../controllers/candidateController.js"

const candidateRouter = express.Router();

candidateRouter.get('/', candidateController.listAllCandidates);

candidateRouter.get('/:id', candidateController.getDetailOfCandidate)

candidateRouter.get('/by-election/:electionId', candidateController.getAllCandidates)

candidateRouter.post('/add', candidateController.addNewCandidate)

candidateRouter.put('/api/update/:id', candidateController.updateCandidate)

candidateRouter.delete('/api/delete/:id', candidateController.deleteCandidate)

export default candidateRouter;