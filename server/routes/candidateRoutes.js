import express from "express"
import candidateController from "../controllers/candidateController.js"
import multer from "multer";
import upload from "../middleware/multer.js";

const candidateRouter = express.Router();

candidateRouter.get('/', candidateController.listAllCandidates);

candidateRouter.get('/:id', candidateController.getDetailOfCandidate)

candidateRouter.get('/by-election/:electionId', candidateController.getAllCandidates)

candidateRouter.post('/add', upload.single("avatar"), candidateController.addNewCandidate) // do 3 things reads the uploaded file from req, convert it in buffer, store it in req.file.buffer -> upload work 

candidateRouter.put('/api/update/:id', candidateController.updateCandidate)

candidateRouter.delete('/api/delete/:id', candidateController.deleteCandidate)

export default candidateRouter;