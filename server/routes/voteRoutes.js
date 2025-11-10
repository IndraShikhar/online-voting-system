import express from "express"

const router = express.Router();

router.post('/cast', (req, res) => {
    // Cast a vote for a candidate (voter only) 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.get('/status/:electionId', (req, res) => {
    // Check if user has voted in this election

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.get('/results/:electionId', (req, res) => {
    // Get current or final results (depending on status) 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.get('/count/:electionId', (req, res) => {
    // Get total votes for each candidate (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

export default router;