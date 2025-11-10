import express from "express"
import electionController from "../controllers/electionController.js"
const electionRouter = express.Router();

electionRouter.post('/create', electionController.createNewElection)

electionRouter.get('/', electionController.getAllElections)

electionRouter.get('/:id', electionController.getDetailOfElection)

electionRouter.patch('/start/:id', electionController.startElection)

electionRouter.patch('/end/:id', electionController.endElection)

electionRouter.patch('/declare-result/:id', electionController.declareResults)

electionRouter.delete('/delete/:id', electionController.deleteElection)


export default electionRouter;