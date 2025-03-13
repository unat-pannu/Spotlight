const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;
const FILE_PATH = "portfolio.json";

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Load portfolio data
const loadPortfolio = () => {
    if (!fs.existsSync(FILE_PATH)) {
        return { skills: "", experience: "", projects: [] };
    }
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
};

// Save portfolio data
const savePortfolio = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// Get portfolio data
app.get("/portfolio", (req, res) => {
    res.json(loadPortfolio());
});

// Update skills and experience
app.put("/update-profile", (req, res) => {
    let portfolio = loadPortfolio();
    portfolio.skills = req.body.skills;
    portfolio.experience = req.body.experience;
    savePortfolio(portfolio);
    res.json({ message: "Profile updated" });
});

// Get all projects
app.get("/projects", (req, res) => {
    let portfolio = loadPortfolio();
    res.json(portfolio.projects);
});

// Add a project
app.post("/add", (req, res) => {
    let portfolio = loadPortfolio();
    const newProject = { id: Date.now().toString(), ...req.body };
    portfolio.projects.push(newProject);
    savePortfolio(portfolio);
    res.json({ message: "Project added", project: newProject });
});

// Update a project
app.put("/update", (req, res) => {
    let portfolio = loadPortfolio();
    portfolio.projects = portfolio.projects.map(project =>
        project.id === req.body.id ? { ...project, ...req.body } : project
    );
    savePortfolio(portfolio);
    res.json({ message: "Project updated" });
});

// Delete a project
app.delete("/delete", (req, res) => {
    let portfolio = loadPortfolio();
    portfolio.projects = portfolio.projects.filter(project => project.id !== req.body.id);
    savePortfolio(portfolio);
    res.json({ message: "Project deleted" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
