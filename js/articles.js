// Handle mobile filter toggle
document.addEventListener("DOMContentLoaded", () => {
  const filterToggle = document.getElementById("filter-toggle")
  const sidebar = document.querySelector(".archive-sidebar")

  if (filterToggle && sidebar) {
    filterToggle.addEventListener("click", () => {
      sidebar.classList.toggle("show-mobile")

      if (sidebar.classList.contains("show-mobile")) {
        filterToggle.innerHTML = '<i class="fas fa-times"></i> Hide Filters'
        document.body.style.overflow = "hidden"

        // Add overlay
        const overlay = document.createElement("div")
        overlay.className = "filter-overlay"
        overlay.style.position = "fixed"
        overlay.style.top = "0"
        overlay.style.left = "0"
        overlay.style.width = "100%"
        overlay.style.height = "100%"
        overlay.style.backgroundColor = "rgba(0,0,0,0.5)"
        overlay.style.zIndex = "999"
        document.body.appendChild(overlay)

        // Close sidebar when clicking overlay
        overlay.addEventListener("click", () => {
          sidebar.classList.remove("show-mobile")
          filterToggle.innerHTML = '<i class="fas fa-filter"></i> Show Filters'
          document.body.style.overflow = ""
          document.body.removeChild(overlay)
        })

        // Close button in sidebar
        const closeBtn = document.createElement("button")
        closeBtn.innerHTML = "×"
        closeBtn.className = "filter-close-btn"
        closeBtn.style.position = "absolute"
        closeBtn.style.top = "15px"
        closeBtn.style.right = "15px"
        closeBtn.style.background = "none"
        closeBtn.style.border = "none"
        closeBtn.style.color = "#fff"
        closeBtn.style.fontSize = "24px"
        closeBtn.style.cursor = "pointer"
        sidebar.appendChild(closeBtn)

        closeBtn.addEventListener("click", () => {
          sidebar.classList.remove("show-mobile")
          filterToggle.innerHTML = '<i class="fas fa-filter"></i> Show Filters'
          document.body.style.overflow = ""
          document.body.removeChild(overlay)
          sidebar.removeChild(closeBtn)
        })
      } else {
        filterToggle.innerHTML = '<i class="fas fa-filter"></i> Show Filters'
        document.body.style.overflow = ""

        // Remove overlay if exists
        const overlay = document.querySelector(".filter-overlay")
        if (overlay) {
          document.body.removeChild(overlay)
        }

        // Remove close button if exists
        const closeBtn = document.querySelector(".filter-close-btn")
        if (closeBtn) {
          sidebar.removeChild(closeBtn)
        }
      }
    })
  }

  // Handle category filtering
  const categoryLinks = document.querySelectorAll(".filter-list a")
  const articleCards = document.querySelectorAll(".article-card")

  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Remove active class from all links
      categoryLinks.forEach((l) => l.classList.remove("active"))

      // Add active class to clicked link
      this.classList.add("active")

      const category = this.getAttribute("data-category")

      // Show/hide articles based on category
      articleCards.forEach((card) => {
        const articleCategory = card.querySelector(".article-category").textContent.toLowerCase()

        if (category === "all" || articleCategory === category.toLowerCase()) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })
})
