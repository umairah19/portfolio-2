function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("active");
}

const API_URL = "https://portfolio-2-production-a642.up.railway.app/api/projects";


async function loadProjects() {
  const projectsContainer = document.getElementById("homepageProjects");

  if (!projectsContainer) {
    console.error("homepageProjects div not found in index.html");
    return;
  }

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("API request failed. Status: " + response.status);
    }

    const projects = await response.json();
    const projectCount = document.getElementById("projectCount");

    if (projectCount) {
      projectCount.textContent = projects.length;
    }

    projectsContainer.innerHTML = "";

    if (projects.length === 0) {
      projectsContainer.innerHTML = "<p>No projects found.</p>";
      return;
    }

    projects.forEach((project, index) => {
      const tags = project.tags
        ? project.tags.split(",").map(tag => `<span>${tag.trim()}</span>`).join("")
        : "";

      projectsContainer.innerHTML += `
        <div class="project-card">
          <span class="project-number">${String(index + 1).padStart(2, "0")}</span>

          <p class="project-category">${project.category}</p>

          <h3>${project.title}</h3>

          <p>${project.description}</p>

          <div class="project-tags">
            ${tags}
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error loading projects:", error);

    projectsContainer.innerHTML = `
      <p style="color: #ff5c5c; text-align: center;">
        Projects could not be loaded. Make sure the backend server is running.
      </p>
    `;
  }
}

loadProjects();