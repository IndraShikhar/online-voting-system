import express from "express"

const router = express.Router();

router.post('/create', (req, res) => {
    // Create a new election (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.get('/', (req, res) => {
    // Get all elections

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.get('/:id', (req, res) => {
    // Get details of one election

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.patch('/start/:id', (req, res) => {
    // Start an election (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.patch('/end/:id', (req, res) => {
    // End an election (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.patch('/declare-result/:id', (req, res) => {
    // Declare results (admin only) 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.delete('/delete/:id', (req, res) => {
    // Delete an election (admin only) 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})


export default router;