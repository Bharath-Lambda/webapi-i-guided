const express = require("express");
const db = require("./data/hubs-model.js")

const server = express();

server.use(express.json());

//GET
server.get("/", (req, res) => {
    res.send("Hello World!");
})

server.get("/now", (req, res) => {
    var date = new Date();
    var timestamp = date.toISOString();
    res.send(timestamp);
})

server.get("/hubs", (req, res) => {
    db.find()
    .then(hubs => {
        res.status(200).json(hubs);
    })
    .catch(err => {
        res.status(500).json({ success: false, err})
    })
})

server.get("/hubs/:id", (req, res) => {
    db.findById(req.params.id)
    .then(hub => {
            if (hub) {
                res.status(200).json({
                    success: true,
                    hub
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "We cannot find what you are looking for"
                })
            }
        }
    )
    .catch(err => {
            res.status(404).json({
                success: false,
                err
            })
        })
})

//POST
server.post("/hubs", (req, res) => {
    const hubInfo = req.body;

    db.add(hubInfo)
        .then(hub => {
            res.status(201).json({ success: true, hub });
        })
        .catch(error => {
            res.status(500).json({ success: false, error });
        });
});

//DELETE
server.delete("/hubs/:id", (req, res) => {
    const { id } = req.params;

    db.remove(id)
    .then(
        deleted => {
            if(deleted) {
                res.status(204).end();
            } else {
                res.status(404).json({
                    success: false,
                    message: "I cannot find the hub you are looking for"
                })
            }
        }
    )
})

//UPDATE
server.put("/hubs/:id", (req,res) => {
    const { id } = req.params;
    const changes = req.body;

    db.update(id,changes).then(updated => {
        if (updated) {
            res.status(200).json({ success: true, updated})
        } else {
            res.status(404).json({ success: false, message: "I cannot find the hub you are looking for"})
        }
    })
})

server.listen(4000, () => {
    console.log(`\n--- Server running on -- \n`)
})