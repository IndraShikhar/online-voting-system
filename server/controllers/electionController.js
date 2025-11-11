const electionController = {
    createNewElection (req, res) {
    // Create a new election (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
},
getAllElections  (req, res)  {
    // Get all elections

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
},
getDetailOfElection (req, res) {
    // Get details of one election

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
},
startElection (req, res)  {
    // Start an election (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
}, 
endElection (req, res) {
    // End an election (admin only)

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
}, 
declareResults (req, res) {
    // Declare results (admin only) 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
},
deleteElection (req, res) {
    // Delete an election (admin only) 

    res.status(200)
        .json({
            status: "Success",
            data: {
                message: `You accessed ${req.originalUrl}`
            }
        })
}
}

export default electionController;