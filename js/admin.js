// Common admin functionality
document.addEventListener("DOMContentLoaded", () => {
  // Create and add mobile sidebar toggle
  const sidebarToggle = document.createElement("button")
  sidebarToggle.className = "sidebar-toggle"
  sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>'
  sidebarToggle.setAttribute("aria-label", "Toggle sidebar")

  const adminHeader = document.querySelector(".admin-header")
  if (adminHeader) {
    adminHeader.insertBefore(sidebarToggle, adminHeader.firstChild)
  }

  const adminSidebar = document.querySelector(".admin-sidebar")

  // Mobile sidebar toggle functionality
  sidebarToggle.addEventListener("click", (e) => {
    e.stopPropagation()
    adminSidebar.classList.toggle("show")
    document.body.classList.toggle("sidebar-open")
  })

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= 992 &&
      adminSidebar &&
      !adminSidebar.contains(event.target) &&
      !sidebarToggle.contains(event.target)
    ) {
      adminSidebar.classList.remove("show")
      document.body.classList.remove("sidebar-open")
    }
  })

  // Close sidebar on window resize if desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      adminSidebar.classList.remove("show")
      document.body.classList.remove("sidebar-open")
    }
  })

  // Dropdown for user menu
  const adminUser = document.querySelector(".admin-user")
  if (adminUser) {
    adminUser.addEventListener("click", (e) => {
      e.preventDefault()
      // Create dropdown if it doesn't exist
      let dropdown = adminUser.querySelector(".user-dropdown")
      if (!dropdown) {
        dropdown = document.createElement("div")
        dropdown.className = "user-dropdown"
        dropdown.innerHTML = `
          <a href="#profile"><i class="fas fa-user"></i> Profile</a>
          <a href="#settings"><i class="fas fa-cog"></i> Settings</a>
          <a href="#" id="dropdown-logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
        `
        adminUser.appendChild(dropdown)

        // Add logout functionality to dropdown
        dropdown.querySelector("#dropdown-logout").addEventListener("click", (e) => {
          e.preventDefault()
          if (confirm("Are you sure you want to logout?")) {
            window.location.href = "index.html"
          }
        })
      }

      dropdown.classList.toggle("show")

      // Close dropdown when clicking outside
      setTimeout(() => {
        document.addEventListener("click", function closeDropdown(e) {
          if (!adminUser.contains(e.target)) {
            dropdown.classList.remove("show")
            document.removeEventListener("click", closeDropdown)
          }
        })
      }, 0)
    })
  }

  // Notifications dropdown
  const notificationBtn = document.querySelector(".notification-btn")
  if (notificationBtn) {
    notificationBtn.addEventListener("click", (e) => {
      e.preventDefault()
      // Create notifications dropdown if it doesn't exist
      let notifDropdown = document.querySelector(".notifications-dropdown")
      if (!notifDropdown) {
        notifDropdown = document.createElement("div")
        notifDropdown.className = "notifications-dropdown"
        notifDropdown.innerHTML = `
          <div class="notification-header">
            <h4>Notifications</h4>
            <span class="mark-all-read">Mark all as read</span>
          </div>
          <div class="notification-list">
            <div class="notification-item unread">
              <i class="fas fa-shopping-cart"></i>
              <div class="notification-content">
                <p>New order #ADS12345678</p>
                <span class="notification-time">2 minutes ago</span>
              </div>
            </div>
            <div class="notification-item unread">
              <i class="fas fa-user"></i>
              <div class="notification-content">
                <p>New user registration</p>
                <span class="notification-time">5 minutes ago</span>
              </div>
            </div>
            <div class="notification-item">
              <i class="fas fa-box"></i>
              <div class="notification-content">
                <p>Product stock low</p>
                <span class="notification-time">1 hour ago</span>
              </div>
            </div>
          </div>
          <div class="notification-footer">
            <a href="#all-notifications">View all notifications</a>
          </div>
        `
        notificationBtn.parentNode.appendChild(notifDropdown)
      }

      notifDropdown.classList.toggle("show")

      // Close dropdown when clicking outside
      setTimeout(() => {
        document.addEventListener("click", function closeNotifDropdown(e) {
          if (!notificationBtn.parentNode.contains(e.target)) {
            notifDropdown.classList.remove("show")
            document.removeEventListener("click", closeNotifDropdown)
          }
        })
      }, 0)
    })
  }

  // Logout functionality
  const logoutBtn = document.getElementById("admin-logout")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (confirm("Are you sure you want to logout?")) {
        // Add loading state
        logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging out...</span>'

        // Simulate logout delay
        setTimeout(() => {
          window.location.href = "index.html"
        }, 1000)
      }
    })
  }

  // Highlight current page in sidebar
  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html"
  const sidebarLinks = document.querySelectorAll(".admin-nav a")

  sidebarLinks.forEach((link) => {
    link.classList.remove("active")
    const linkPage = link.getAttribute("href")
    if (linkPage === currentPage) {
      link.classList.add("active")
    }
  })

  // Enhanced table responsiveness
  const tables = document.querySelectorAll(".admin-table")
  tables.forEach((table) => {
    // Add mobile-friendly table wrapper
    if (!table.closest(".table-responsive")) {
      const wrapper = document.createElement("div")
      wrapper.className = "table-responsive"
      table.parentNode.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    }

    // Add mobile table cards for small screens
    if (window.innerWidth <= 768) {
      createMobileTableCards(table)
    }
  })

  // Handle window resize for table responsiveness
  window.addEventListener("resize", () => {
    tables.forEach((table) => {
      if (window.innerWidth <= 768) {
        createMobileTableCards(table)
      } else {
        removeMobileTableCards(table)
      }
    })
  })

  // Close modals functionality
  const closeModalButtons = document.querySelectorAll(".close-modal, .cancel-btn")
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const modal = this.closest(".modal")
      if (modal) {
        closeModal(modal)
      }
    })
  })

  // Close modal when clicking outside
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this)
      }
    })
  })

  // ESC key to close modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModal = document.querySelector('.modal[style*="flex"]')
      if (openModal) {
        closeModal(openModal)
      }
    }
  })

  // Form tabs functionality
  const formTabs = document.querySelectorAll(".form-tab")
  formTabs.forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault()
      const tabId = this.getAttribute("data-tab")

      // Remove active class from all tabs and content
      document.querySelectorAll(".form-tab").forEach((t) => t.classList.remove("active"))
      document.querySelectorAll(".form-tab-content").forEach((c) => c.classList.remove("active"))

      // Add active class to current tab and content
      this.classList.add("active")
      if (tabId) {
        const tabContent = document.getElementById(tabId)
        if (tabContent) {
          tabContent.classList.add("active")
        }
      }
    })
  })

  // Enhanced image upload preview
  const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]')
  imageInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const file = this.files[0]
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("File size must be less than 5MB")
          this.value = ""
          return
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Please select a valid image file")
          this.value = ""
          return
        }

        const reader = new FileReader()
        const label = this.nextElementSibling || this.closest("label")

        reader.onload = (e) => {
          if (label) {
            label.innerHTML = `
              <img src="${e.target.result}" alt="Preview">
              <div class="image-overlay">
                <i class="fas fa-edit"></i>
                <span>Change Image</span>
              </div>
            `
            label.classList.add("has-image")
          }
        }

        reader.readAsDataURL(file)
      }
    })
  })

  // Select all functionality
  const selectAllCheckboxes = document.querySelectorAll("#select-all")
  selectAllCheckboxes.forEach((selectAll) => {
    selectAll.addEventListener("change", function () {
      const table = this.closest("table")
      const selectItems = table.querySelectorAll(".select-item")
      selectItems.forEach((item) => {
        item.checked = this.checked
      })

      // Update bulk actions visibility
      updateBulkActions(table)
    })
  })

  // Individual checkbox functionality
  const selectItems = document.querySelectorAll(".select-item")
  selectItems.forEach((item) => {
    item.addEventListener("change", function () {
      const table = this.closest("table")
      const selectAll = table.querySelector("#select-all")
      const allItems = table.querySelectorAll(".select-item")
      const checkedItems = table.querySelectorAll(".select-item:checked")

      selectAll.checked = checkedItems.length === allItems.length
      selectAll.indeterminate = checkedItems.length > 0 && checkedItems.length < allItems.length

      // Update bulk actions visibility
      updateBulkActions(table)
    })
  })

  // Enhanced search functionality
  const searchInputs = document.querySelectorAll('.header-search input, .admin-filters input[type="text"]')
  searchInputs.forEach((input) => {
    let searchTimeout
    input.addEventListener("input", function () {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        performSearch(this.value)
      }, 300)
    })
  })

  // Filter functionality
  const filterSelects = document.querySelectorAll(".admin-filters select")
  filterSelects.forEach((select) => {
    select.addEventListener("change", () => {
      applyFilters()
    })
  })

  // Add loading states to buttons
  const actionButtons = document.querySelectorAll(".btn-primary, .btn-secondary")
  actionButtons.forEach((button) => {
    if (button.type === "submit") {
      button.addEventListener("click", function () {
        if (this.form && this.form.checkValidity()) {
          addLoadingState(this)
        }
      })
    }
  })

  // Add CSS for new functionality
  addAdditionalStyles()
})

// Helper functions
function createMobileTableCards(table) {
  if (table.querySelector(".mobile-cards")) return

  const tbody = table.querySelector("tbody")
  const headers = Array.from(table.querySelectorAll("th")).map((th) => th.textContent.trim())
  const rows = Array.from(tbody.querySelectorAll("tr"))

  const mobileContainer = document.createElement("div")
  mobileContainer.className = "mobile-cards"

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td"))
    const card = document.createElement("div")
    card.className = "mobile-card"

    cells.forEach((cell, index) => {
      if (headers[index] && cell.textContent.trim()) {
        const field = document.createElement("div")
        field.className = "mobile-field"
        field.innerHTML = `
          <span class="field-label">${headers[index]}:</span>
          <span class="field-value">${cell.innerHTML}</span>
        `
        card.appendChild(field)
      }
    })

    mobileContainer.appendChild(card)
  })

  table.style.display = "none"
  table.parentNode.appendChild(mobileContainer)
}

function removeMobileTableCards(table) {
  const mobileCards = table.parentNode.querySelector(".mobile-cards")
  if (mobileCards) {
    mobileCards.remove()
    table.style.display = "table"
  }
}

function closeModal(modal) {
  modal.style.display = "none"
  document.body.classList.remove("modal-open")

  // Reset form if exists
  const form = modal.querySelector("form")
  if (form) {
    form.reset()
    // Remove validation classes
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"))
  }
}

function updateBulkActions(table) {
  const checkedItems = table.querySelectorAll(".select-item:checked")
  let bulkActions = document.querySelector(".bulk-actions")

  if (checkedItems.length > 0) {
    if (!bulkActions) {
      bulkActions = document.createElement("div")
      bulkActions.className = "bulk-actions"
      bulkActions.innerHTML = `
        <span class="bulk-count">${checkedItems.length} items selected</span>
        <button class="btn-secondary bulk-delete">
          <i class="fas fa-trash"></i> Delete Selected
        </button>
        <button class="btn-secondary bulk-export">
          <i class="fas fa-download"></i> Export Selected
        </button>
      `
      table.closest(".admin-card").insertBefore(bulkActions, table.closest(".table-responsive"))
    } else {
      bulkActions.querySelector(".bulk-count").textContent = `${checkedItems.length} items selected`
    }
    bulkActions.style.display = "flex"
  } else if (bulkActions) {
    bulkActions.style.display = "none"
  }
}

function performSearch(query) {
  // Implement search functionality
  console.log("Searching for:", query)
  // In a real application, this would filter the table or make an API call
}

function applyFilters() {
  // Implement filter functionality
  console.log("Applying filters")
  // In a real application, this would filter the data
}

function addLoadingState(button) {
  const originalText = button.innerHTML
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
  button.disabled = true

  // Remove loading state after 2 seconds (simulate processing)
  setTimeout(() => {
    button.innerHTML = originalText
    button.disabled = false
  }, 2000)
}

function addAdditionalStyles() {
  const style = document.createElement("style")
  style.textContent = `
    /* User Dropdown */
    .admin-user {
      position: relative;
    }
    
    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 180px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }
    
    .user-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .user-dropdown a {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      transition: all 0.3s ease;
      border-bottom: 1px solid #f1f3f4;
    }
    
    .user-dropdown a:last-child {
      border-bottom: none;
    }
    
    .user-dropdown a:hover {
      background-color: #f8f9fa;
      color: #ff0000;
    }
    
    .user-dropdown a i {
      margin-right: 10px;
      width: 16px;
    }
    
    /* Notifications Dropdown */
    .notifications {
      position: relative;
    }
    
    .notifications-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 320px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }
    
    .notifications-dropdown.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #f1f3f4;
    }
    
    .notification-header h4 {
      margin: 0;
      font-size: 16px;
      color: #2c3e50;
    }
    
    .mark-all-read {
      font-size: 12px;
      color: #ff0000;
      cursor: pointer;
    }
    
    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .notification-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 16px;
      border-bottom: 1px solid #f8f9fa;
      transition: all 0.3s ease;
    }
    
    .notification-item:hover {
      background-color: #f8f9fa;
    }
    
    .notification-item.unread {
      background-color: rgba(255, 0, 0, 0.05);
    }
    
    .notification-item i {
      margin-right: 12px;
      margin-top: 2px;
      color: #ff0000;
    }
    
    .notification-content p {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #2c3e50;
    }
    
    .notification-time {
      font-size: 12px;
      color: #666;
    }
    
    .notification-footer {
      padding: 12px 16px;
      border-top: 1px solid #f1f3f4;
      text-align: center;
    }
    
    .notification-footer a {
      color: #ff0000;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }
    
    /* Mobile Table Cards */
    .mobile-cards {
      display: none;
    }
    
    @media (max-width: 768px) {
      .mobile-cards {
        display: block;
      }
      
      .mobile-card {
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .mobile-field {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f1f3f4;
      }
      
      .mobile-field:last-child {
        border-bottom: none;
      }
      
      .field-label {
        font-weight: 600;
        color: #555;
        font-size: 14px;
      }
      
      .field-value {
        text-align: right;
        flex: 1;
        margin-left: 12px;
      }
    }
    
    /* Bulk Actions */
    .bulk-actions {
      display: none;
      align-items: center;
      gap: 15px;
      padding: 15px 20px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e1e5e9;
    }
    
    .bulk-count {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .bulk-actions button {
      padding: 8px 12px;
      font-size: 14px;
    }
    
    /* Image Upload Overlay */
    .image-upload-label.has-image {
      position: relative;
      overflow: hidden;
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .image-upload-label.has-image:hover .image-overlay {
      opacity: 1;
    }
    
    .image-overlay i {
      font-size: 20px;
      margin-bottom: 5px;
    }
    
    .image-overlay span {
      font-size: 12px;
    }
    
    /* Sidebar Mobile Overlay */
    @media (max-width: 992px) {
      .admin-sidebar {
        position: fixed;
        z-index: 1001;
      }
      
      .admin-sidebar.show::before {
        content: '';
        position: fixed;
        top: 0;
        left: 280px;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: -1;
      }
    }
    
    /* Loading States */
    .btn-primary:disabled,
    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Form Validation */
    .form-group input.is-invalid,
    .form-group select.is-invalid,
    .form-group textarea.is-invalid {
      border-color: #e74c3c;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
    
    .invalid-feedback {
      display: block;
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
    }
    
    /* Responsive Improvements */
    @media (max-width: 576px) {
      .notifications-dropdown {
        width: 280px;
        right: -20px;
      }
      
      .user-dropdown {
        right: -10px;
      }
      
      .chart-content {
        height: 250px;
      }
      
      .stat-card {
        padding: 20px;
      }
      
      .admin-table th,
      .admin-table td {
        padding: 12px 15px;
      }
    }
  `
  document.head.appendChild(style)
}
