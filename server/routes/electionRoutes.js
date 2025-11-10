import express from "express"
import electionController from "../controllers/electionController.js"
const router = express.Router();

router.post('/create', electionController.createNewElection)

router.get('/', electionController.getAllElections)

router.get('/:id', electionController.getDetailOfElection)

router.patch('/start/:id', electionController.startElection)

router.patch('/end/:id', electionController.endElection)

router.patch('/declare-result/:id', electionController.declareResults)

router.delete('/delete/:id', electionController.deleteElection)


export default router;