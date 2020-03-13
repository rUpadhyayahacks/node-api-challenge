const express = require("express");

const Actions = require("../data/helpers/actionModel.js");
const Projects = require("../data/helpers/projectModel.js");

const router = express.Router();

// 1. Get all actions

router.get("/", (req, res) => {
  Actions.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Error retrieving actions." });
    });
});

router.get("/:id", validateProjectID, (req, res) => {
  res.status(200).json(req.actions);
});

// 2. Post Requests:

router.post("/", (req, res) => {
  // console.log(req.body, "hello");

  if (!req.body.project_id || !req.body.description || !req.body.notes) {
    res.status(400).json({
      errorMessage:
        "Error, needed to add an action: project_id, description, and notes."
    });
  } else {
    Actions.insert(req.body)
      .then(action => {
        console.log(action, "actions");
        res.status(200).json(action);
      })
      .catch(error => {
        res.status(500).json({ error: "Server error" });
      });
  }
});

// 3. Put Requests:
router.put("/:id", validateProjectID, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  if (!changes.notes || !changes.description) {
    res.status(400).json({
      errorMessage: "Error, update the Project notes AND description."
    });
  } else {
    Actions.update(id, changes)

      .then(update => {
        res.status(200).json(update);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: "Failed to update Project." });
      });
  }
});

// 4. Delete Requests:

router.delete("/:id", validateProjectID, (req, res) => {
  const { id } = req.params;
  Actions.remove(id)
    .then(action => {
      res.status(200).json({ message: "The action has been removed." });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The action could not be removed. " });
    });
});
// custom middleware


function validateProjectID(req, res, next) {
  const { id } = req.params;

  Actions.get(id)
    .then(action => {
      if (action) {
        req.actions = action;
        next();
      } else {
        res.status(400).json({ errorMessage: "Invalid ID" });
      }
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "Server error validating project Action ID." });
    });
}

module.exports = router;