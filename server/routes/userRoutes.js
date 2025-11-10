import express from "express"

const router = express.Router();

router.post('/register', (req, res) => {
    // Register a new user (voter/admin)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.post('/login', (req, res) => {
    // Login and get JWT token

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.get('/profile', (req, res) => {
    // Get logged-in user's details 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.put('/profile', (req, res) => {
    // Update user's info (optional)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.get('/all', (req, res) => {
    // Get list of all users (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})

router.patch('/block/:userId', (req, res) => {
    // Block or deactivate a user (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
})



export default router;