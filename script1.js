document.addEventListener("DOMContentLoaded", () => {
    const projectsList = document.getElementById("projects-list");
    const addProjectBtn = document.getElementById("add-project");

    const fetchProjects = async () => {
        const response = await fetch("http://localhost:3000/projects");
        const projects = await response.json();
        displayProjects(projects);
    };

    const displayProjects = (projects) => {
        projectsList.innerHTML = "";
        projects.forEach(project => {
            const projectElement = document.createElement("div");
            projectElement.classList.add("project");
            projectElement.innerHTML = `
                <div>
                    <h4>${project.title}</h4>
                    <p>${project.description}</p>
                </div>
                <div>
                    <button class="edit" data-id="${project.id}">Edit</button>
                    <button class="delete" data-id="${project.id}">Delete</button>
                </div>
            `;
            projectsList.appendChild(projectElement);
        });
    };

    addProjectBtn.addEventListener("click", async () => {
        const title = prompt("Enter project title:");
        const description = prompt("Enter project description:");
        if (title && description) {
            await fetch("http://localhost:3000/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            });
            fetchProjects();
        }
    });

    projectsList.addEventListener("click", async (e) => {
        if (e.target.classList.contains("edit")) {
            const id = e.target.dataset.id;
            const newTitle = prompt("Edit project title:");
            const newDescription = prompt("Edit project description:");
            if (newTitle && newDescription) {
                await fetch("http://localhost:3000/update", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, title: newTitle, description: newDescription })
                });
                fetchProjects();
            }
        }
        
        if (e.target.classList.contains("delete")) {
            const id = e.target.dataset.id;
            await fetch("http://localhost:3000/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            fetchProjects();
        }
    });

    fetchProjects();
});
