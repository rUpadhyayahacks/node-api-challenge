const express = require("express");

const ProjectsDb = require("../data/helpers/projectModel");

const router = express.Router();

// GET Requests:

// 1. Get all Projects
router.get("/", (req, res) => {
  ProjectsDb.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Error retrieving Projects." });
    });
});

// 2. Get Projects by ID
router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(req.project);
});

// Post Requests:

// Add a new Project
router.post("/", validateProject, (req, res) => {
  res.status(200).json(req.projects);
});

// Put Requests:

// Update a Project name & description
router.put("/:id", validateProjectId, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  if (!changes.name || !changes.description) {
    res.status(400).json({
      errorMessage: "Error, update the Project name AND description."
    });
  } else {
    ProjectsDb.update(id, changes)
      .then(update => {
        res.status(200).json(update);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: "Failed to update Project." });
      });
  }
});

// Delete Requests:

// This deletes a Project
router.delete("/:id", validateProjectId, (req, res) => {
  const { id } = req.params;
  ProjectsDb.remove(id)
    .then(project => {
      res.status(200).json({ message: "The Project has been removed." });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The Project could not be removed." });
    });
});

// custom middleware
function validateProjectId(req, res, next) {
  const { id } = req.params;
  console.log("id", id);
  ProjectsDb.get(id)
    .then(project => {
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(400).json({ errorMessage: "Invalid Project ID." });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Error retrieving Project by ID" });
    });
}

function validateProject(req, res, next) {
  const { name, description } = req.body;
  console.log(req.body);
  if (!name || !description) {
    res.status(400).json({
      errorMessage: "Error, provide a name and description for Project."
    });
  } else {
    ProjectsDb.insert(req.body)
      .then(project => {
        next();
      })
      .catch(error => {
        res.status(500).json({ error: "Error adding new Project." });
      });
  }
}

module.exports = router;