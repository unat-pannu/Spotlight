const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const EventEmitter = require("events");
const app = express();
const PORT = 3000;
const FILE_PATH = "portfolio.json";

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

class AuthEmitter extends EventEmitter {}
const authEmitter = new AuthEmitter();

const loadPortfolio = () => {
    if (!fs.existsSync(FILE_PATH)) {
        return { skills: "", experience: "", projects: [] };
    }
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
};

const savePortfolio = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

app.get("/portfolio", (req, res) => {
    res.json(loadPortfolio());
});

app.put("/update-profile", (req, res) => {
    let portfolio = loadPortfolio();
    portfolio.skills = req.body.skills;
    portfolio.experience = req.body.experience;
    savePortfolio(portfolio);
    res.json({ message: "Profile updated" });
});

app.get("/projects", (req, res) => {
    let portfolio = loadPortfolio();
    res.json(portfolio.projects);
});

app.post("/add", (req, res) => {
    let portfolio = loadPortfolio();
    const newProject = { id: Date.now().toString(), ...req.body };
    portfolio.projects.push(newProject);
    savePortfolio(portfolio);
    res.json({ message: "Project added", project: newProject });
});

app.put("/update", (req, res) => {
    let portfolio = loadPortfolio();
    portfolio.projects = portfolio.projects.map(project =>
        project.id === req.body.id ? { ...project, ...req.body } : project
    );
    savePortfolio(portfolio);
    res.json({ message: "Project updated" });
});

app.delete("/delete", (req, res) => {
    let portfolio = loadPortfolio();
    portfolio.projects = portfolio.projects.filter(project => project.id !== req.body.id);
    savePortfolio(portfolio);
    res.json({ message: "Project deleted" });
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sqlmain2024",
    database: "userDB",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

app.post("/register", (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }
    const sql = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
    const values = [firstName, lastName, email, password];
    db.query(sql, values, (err) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ message: "Error registering user" });
        }
        res.json({ message: "User registered successfully!" });
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error logging in" });
        }
        if (results.length > 0) {
            authEmitter.emit("loginSuccess", results[0]);
            res.json({ success: true, message: "Login successful", user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    });
});

authEmitter.once("loginSuccess", (user) => {
    console.log("User logged in for the first time:", user.email);
});

authEmitter.on("newListener", (event) => {
    console.log(`New listener added for event: ${event}`);
});

authEmitter.on("tempListener", () => {
    console.log("Temporary listener triggered");
});

authEmitter.removeListener("tempListener", () => {
    console.log("Temporary listener removed");
});


authEmitter.on("inspectListeners", (eventName) => {
    console.log(`Listeners for ${eventName}:`, authEmitter.listeners(eventName));
});

console.log("Current listeners for loginSuccess:", authEmitter.listenerCount("loginSuccess"));

authEmitter.emit("inspectListeners", "loginSuccess");

global.authEmitter = authEmitter;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});