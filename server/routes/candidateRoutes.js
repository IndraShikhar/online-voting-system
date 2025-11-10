import express from "express"

const router = express.Router();

router.get('/', (req, res) => {
    // Get list of all candidates 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})
router.get('/:id', (req, res) => {
    // Get details of a candidate

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.get('/by-election/:electionId', (req, res) => {

    // Get all candidates for a specific election

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.post('/add', (req, res) => {
    // Add a new candidate (admin only) 

    console.log(req);
    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.put('/api/update/:id', (req, res) => {
    // Update candidate details (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.delete('/api/delete/:id', (req, res) => {
    // Delete candidate (admin only) 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

export default router;