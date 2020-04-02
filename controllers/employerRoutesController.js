

module.exports.assignNewTask = (req, res, next) => {
    console.log(req.body)

    res.json({
        body: req.body
    })
}