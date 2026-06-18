if (localStorage.getItem("isAdminLoggedIn") !== "true") {
  window.location.href = "login.html";
}

const API_URL = "http://localhost:5000/api/projects";

const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");
const message = document.getElementById("message");
const projectTotal = document.getElementById("projectTotal");

const projectId = document.getElementById("projectId");
const title = document.getElementById("title");
const category = document.getElementById("category");
const description = document.getElementById("description");
const tags = document.getElementById("tags");

function loadProjects() {
  fetch(API_URL)
    .then(response => response.json())
    .then(projects => {
      projectsList.innerHTML = "";

      if (projectTotal) {
        projectTotal.textContent = projects.length;
      }

      if (projects.length === 0) {
        projectsList.innerHTML = `
          <div class="empty-message">
            No projects available. Add a project using the form.
          </div>
        `;
        return;
      }

      projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "project-card";

        const tagItems = project.tags
          ? project.tags.split(",").map(tag => `<span>${tag.trim()}</span>`).join("")
          : "";

        card.innerHTML = `
          <p class="project-category">${project.category}</p>

          <h3>${project.title}</h3>

          <p class="project-description">${project.description}</p>

          <div class="tag-list">
            ${tagItems}
          </div>

          <div class="actions">
            <button class="edit-btn" data-id="${project.id}">
              Edit
            </button>

            <button class="delete-btn" data-id="${project.id}">
              Delete
            </button>
          </div>
        `;

        card.querySelector(".edit-btn").addEventListener("click", () => {
          editProject(project);
        });

        card.querySelector(".delete-btn").addEventListener("click", () => {
          deleteProject(project.id);
        });

        projectsList.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error loading projects:", error);
      projectsList.innerHTML = `
        <div class="empty-message">
          Unable to load projects. Make sure the backend server is running.
        </div>
      `;
    });
}

projectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const projectData = {
    title: title.value,
    category: category.value,
    description: description.value,
    tags: tags.value
  };

  if (projectId.value === "") {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(projectData)
    })
      .then(response => response.json())
      .then(() => {
        projectForm.reset();
        message.textContent = "Project saved successfully!";
        loadProjects();
      });
  } else {
    fetch(`${API_URL}/${projectId.value}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(projectData)
    })
      .then(response => response.json())
      .then(() => {
        projectForm.reset();
        projectId.value = "";
        message.textContent = "Project updated successfully!";
        loadProjects();
      });
  }
});

function editProject(project) {
  projectId.value = project.id;
  title.value = project.title;
  category.value = project.category;
  description.value = project.description;
  tags.value = project.tags;

  message.textContent = "Editing selected project...";
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function deleteProject(id) {
  const confirmDelete = confirm("Are you sure you want to delete this project?");

  if (confirmDelete) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    })
      .then(response => response.json())
      .then(() => {
        message.textContent = "Project deleted successfully!";
        loadProjects();
      });
  }
}

loadProjects();

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      localStorage.removeItem("isAdminLoggedIn");
      window.location.href = "login.html";
    }
  });
}