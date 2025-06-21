// Mobile-friendly cart quantity controls
document.addEventListener("DOMContentLoaded", () => {
  // Quantity controls in cart
  const qtyBtns = document.querySelectorAll(".qty-btn")
  if (qtyBtns.length > 0) {
    qtyBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const action = this.getAttribute("data-action")
        const input = this.parentElement.querySelector(".qty-input")
        const value = Number.parseInt(input.value)

        if (action === "decrease" && value > 1) {
          input.value = value - 1
        } else if (action === "increase") {
          input.value = value + 1
        }

        // Update cart item total
        updateCartItemTotal(this.closest(".cart-item"))
      })
    })
  }

  // Update cart item total
  function updateCartItemTotal(cartItem) {
    if (!cartItem) return

    const priceEl = cartItem.querySelector(".price-col")
    const quantityEl = cartItem.querySelector(".qty-input")
    const totalEl = cartItem.querySelector(".total-col")

    if (priceEl && quantityEl && totalEl) {
      const price = Number.parseFloat(priceEl.textContent.replace("$", ""))
      const quantity = Number.parseInt(quantityEl.value)
      const total = price * quantity

      totalEl.textContent = "$" + total.toFixed(2)

      // Update cart totals
      updateCartTotals()
    }
  }

  // Update cart totals
  function updateCartTotals() {
    const subtotalEl = document.getElementById("cart-subtotal")
    const shippingEl = document.getElementById("cart-shipping")
    const discountEl = document.getElementById("cart-discount")
    const discountRow = document.getElementById("discount-row")
    const totalEl = document.getElementById("cart-total")

    if (subtotalEl && shippingEl && totalEl) {
      let subtotal = 0
      const cartItems = document.querySelectorAll(".cart-item")

      cartItems.forEach((item) => {
        const totalText = item.querySelector(".total-col").textContent
        subtotal += Number.parseFloat(totalText.replace("$", ""))
      })

      const shipping = Number.parseFloat(shippingEl.textContent.replace("$", ""))
      let discount = 0

      if (discountEl) {
        discount = Number.parseFloat(discountEl.textContent.replace("-$", ""))
      }

      const total = subtotal + shipping - discount

      subtotalEl.textContent = "$" + subtotal.toFixed(2)
      totalEl.textContent = "$" + total.toFixed(2)

      // Show/hide discount row
      if (discountRow && discount > 0) {
        discountRow.style.display = "flex"
      } else if (discountRow) {
        discountRow.style.display = "none"
      }
    }
  }

  // Checkout form improvements
  const shippingOptions = document.querySelectorAll('input[name="shipping"]')
  const paymentMethods = document.querySelectorAll('input[name="payment"]')

  // Highlight selected shipping option
  if (shippingOptions.length > 0) {
    shippingOptions.forEach((option) => {
      option.addEventListener("change", function () {
        const shippingOptions = document.querySelectorAll(".shipping-option")
        shippingOptions.forEach((opt) => {
          opt.classList.remove("selected")
        })

        this.closest(".shipping-option").classList.add("selected")

        // Update shipping cost
        updateShippingCost(this.value)
      })
    })

    // Initialize selected shipping option
    const selectedShipping = document.querySelector('input[name="shipping"]:checked')
    if (selectedShipping) {
      selectedShipping.closest(".shipping-option").classList.add("selected")
    }
  }

  // Highlight selected payment method
  if (paymentMethods.length > 0) {
    paymentMethods.forEach((method) => {
      method.addEventListener("change", function () {
        const paymentMethods = document.querySelectorAll(".payment-method")
        paymentMethods.forEach((m) => {
          m.classList.remove("selected")
        })

        this.closest(".payment-method").classList.add("selected")

        // Show/hide payment details
        showPaymentDetails(this.value)
      })
    })

    // Initialize selected payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked')
    if (selectedPayment) {
      selectedPayment.closest(".payment-method").classList.add("selected")
      showPaymentDetails(selectedPayment.value)
    }
  }

  // Update shipping cost
  function updateShippingCost(shippingMethod) {
    const shippingCost = document.getElementById("shipping-cost")
    const orderTotal = document.getElementById("order-total")

    if (shippingCost && orderTotal) {
      let cost = 10 // Default cost

      if (shippingMethod === "express") {
        cost = 20
      } else if (shippingMethod === "overnight") {
        cost = 30
      }

      // Update shipping cost
      shippingCost.textContent = "$" + cost.toFixed(2)

      // Update order total
      const subtotal = 270 // Fixed for demo
      const tax = 27 // Fixed for demo
      const total = subtotal + cost + tax

      orderTotal.textContent = "$" + total.toFixed(2)
    }
  }

  // Show/hide payment details
  function showPaymentDetails(paymentMethod) {
    const paymentDetails = document.querySelectorAll(".payment-details")

    if (paymentDetails.length > 0) {
      paymentDetails.forEach((detail) => {
        detail.style.display = "none"
      })

      const selectedDetail = document.getElementById(paymentMethod + "-details")
      if (selectedDetail) {
        selectedDetail.style.display = "block"
      }
    }
  }

  // Transaction history filter
  const orderFilter = document.getElementById("order-filter")
  if (orderFilter) {
    orderFilter.addEventListener("change", function () {
      const filterValue = this.value
      const orderItems = document.querySelectorAll(".order-item")

      if (filterValue === "all") {
        orderItems.forEach((item) => {
          item.style.display = "block"
        })
      } else {
        orderItems.forEach((item) => {
          const statusBadge = item.querySelector(".status-badge")
          if (statusBadge && statusBadge.classList.contains(filterValue)) {
            item.style.display = "block"
          } else {
            item.style.display = "none"
          }
        })
      }
    })
  }
})

function addToCart(productId) {
  // Get product details (in a real app, this would come from an API)
  const product = getProductDetails(productId)

  // Get current cart
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if product is already in cart
  const existingProductIndex = cart.findIndex((item) => item.id === productId)

  if (existingProductIndex !== -1) {
    // Increment quantity if product already exists
    cart[existingProductIndex].quantity += 1
  } else {
    // Add new product to cart
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Show notification
  showAddToCartNotification(product)
}

// Replace the showNotification function with these two specialized functions:

function showAddToCartNotification(product) {
  // Create notification container if it doesn't exist
  let notificationContainer = document.getElementById("cart-notification-container")
  if (!notificationContainer) {
    notificationContainer = document.createElement("div")
    notificationContainer.id = "cart-notification-container"
    notificationContainer.className = "cart-notification-container"
    document.body.appendChild(notificationContainer)
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = "cart-notification"

  // Create notification content
  notification.innerHTML = `
    <div class="notification-product">
      <img src="${product.image}" alt="${product.name}" class="notification-image">
      <div class="notification-details">
        <p class="notification-message">${product.name} added to cart!</p>
        <p class="notification-price">$${product.price.toFixed(2)}</p>
      </div>
    </div>
    <div class="notification-actions">
      <button class="notification-continue">Continue Shopping</button>
      <a href="cart.html" class="notification-view-cart">View Cart</a>
    </div>
  `

  // Add notification to container
  notificationContainer.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 10)

  // Add event listeners to buttons
  const continueBtn = notification.querySelector(".notification-continue")
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      notification.classList.remove("show")
      setTimeout(() => {
        notificationContainer.removeChild(notification)
      }, 300)
    })
  }

  // Hide and remove notification after 5 seconds if not interacted with
  const timeout = setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode === notificationContainer) {
        notificationContainer.removeChild(notification)
      }
    }, 300)
  }, 5000)

  // Clear timeout if user interacts with notification
  notification.addEventListener("mouseenter", () => {
    clearTimeout(timeout)
  })

  // Set new timeout when mouse leaves
  notification.addEventListener("mouseleave", () => {
    const newTimeout = setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (notification.parentNode === notificationContainer) {
          notificationContainer.removeChild(notification)
        }
      }, 300)
    }, 3000)

    // Clear timeout if user interacts again
    notification.addEventListener("mouseenter", () => {
      clearTimeout(newTimeout)
    })
  })
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message

  // Add notification to the DOM
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.style.opacity = "1"
    notification.style.transform = "translateY(0)"
  }, 10)

  // Hide and remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateY(20px)"

    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Add this new function to update the mini cart
function updateMiniCart() {
  const miniCartContainer = document.getElementById("mini-cart-container")
  if (!miniCartContainer) return

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const miniCartItems = miniCartContainer.querySelector(".mini-cart-items")
  const miniCartTotal = miniCartContainer.querySelector(".mini-cart-total")

  // Clear current items
  miniCartItems.innerHTML = ""

  if (cart.length === 0) {
    miniCartItems.innerHTML = '<div class="mini-cart-empty">Your cart is empty</div>'
    miniCartTotal.textContent = "$0.00"
    return
  }

  // Calculate total
  let total = 0

  // Add items to mini cart
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal

    const miniCartItem = document.createElement("div")
    miniCartItem.className = "mini-cart-item"
    miniCartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="mini-cart-image">
      <div class="mini-cart-details">
        <h4>${item.name}</h4>
        <p>${item.quantity} × $${item.price.toFixed(2)}</p>
      </div>
      <button class="mini-cart-remove" data-id="${item.id}">×</button>
    `

    miniCartItems.appendChild(miniCartItem)
  })

  // Update total
  miniCartTotal.textContent = "$" + total.toFixed(2)

  // Add event listeners to remove buttons
  const removeButtons = miniCartContainer.querySelectorAll(".mini-cart-remove")
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-id")
      removeFromCart(productId)
      updateMiniCart()
      updateCartCount()
    })
  })
}

// Add this new function to remove items from cart
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Add this function to toggle the mini cart
function toggleMiniCart() {
  const miniCartContainer = document.getElementById("mini-cart-container")
  if (miniCartContainer) {
    miniCartContainer.classList.toggle("show")

    if (miniCartContainer.classList.contains("show")) {
      updateMiniCart()
    }
  }
}

// Declare getProductDetails and updateCartCount functions
function getProductDetails(productId) {
  // Sample product database
  const products = {
    1: {
      id: "1",
      name: "Adidas Ultraboost 22",
      price: 180.0,
      image: "images/product1.jpg",
      size: "9",
      color: "Black",
    },
    2: {
      id: "2",
      name: "Adidas Superstar",
      price: 90.0,
      image: "images/product2.jpg",
      size: "8.5",
      color: "White",
    },
    3: {
      id: "3",
      name: "Adidas NMD R1",
      price: 140.0,
      image: "images/product3.jpg",
      size: "9",
      color: "Grey",
    },
    4: {
      id: "4",
      name: "Adidas Stan Smith",
      price: 85.0,
      image: "images/product4.jpg",
      size: "8",
      color: "White/Green",
    },
    5: {
      id: "5",
      name: "Adidas Gazelle",
      price: 100.0,
      image: "images/product5.jpg",
      size: "9.5",
      color: "Navy",
    },
    6: {
      id: "6",
      name: "Adidas Forum Low",
      price: 95.0,
      image: "images/product6.jpg",
      size: "10",
      color: "White/Blue",
    },
  }

  return (
    products[productId] || {
      id: productId,
      name: "Sample Product",
      price: 10.0,
      image: "images/placeholder.jpg",
      size: "N/A",
      color: "N/A",
    }
  )
}

// Update the updateCartCount function to add animation
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const count = cart.reduce((total, item) => total + item.quantity, 0)

  // Update cart count in the header
  const cartCountElements = document.querySelectorAll(".cart-count")
  cartCountElements.forEach((element) => {
    // Store previous value for animation
    const prevCount = Number.parseInt(element.textContent) || 0

    // Update the count
    element.textContent = count

    // Add animation if count increased
    if (count > prevCount) {
      element.classList.add("pulse")
      setTimeout(() => {
        element.classList.remove("pulse")
      }, 500)
    }
  })
}

// Declare initializeCart function
function initializeCart() {
  // Dummy implementation for demonstration
  // This function can be used to initialize the cart state if needed
}

// Add to the document ready function at the bottom of the file:
document.addEventListener("DOMContentLoaded", () => {
  // Existing code...

  // Initialize cart
  initializeCart()

  // Add to Cart Functionality
  const addToCartButtons = document.querySelectorAll(".btn-add-cart")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const productId = this.getAttribute("data-id")

      // Add visual feedback
      this.classList.add("adding")

      // Simulate a slight delay for better UX
      setTimeout(() => {
        addToCart(productId)
        this.classList.remove("adding")
        this.classList.add("added")

        setTimeout(() => {
          this.classList.remove("added")
        }, 1500)
      }, 300)
    })
  })

  // Create and append mini-cart to the body
  const miniCartHTML = `
    <div id="mini-cart-container" class="mini-cart-container">
      <div class="mini-cart-header">
        <h3>Your Cart</h3>
        <button id="mini-cart-close">×</button>
      </div>
      <div class="mini-cart-items"></div>
      <div class="mini-cart-footer">
        <div class="mini-cart-subtotal">
          <span>Subtotal:</span>
          <span class="mini-cart-total">$0.00</span>
        </div>
        <a href="cart.html" class="btn btn-checkout">View Cart</a>
        <a href="checkout.html" class="btn">Checkout</a>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", miniCartHTML)

  // Add event listener to cart icon
  const cartIcons = document.querySelectorAll('.nav-desktop a[href="cart.html"], .bottom-nav-item[href="cart.html"]')
  cartIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      // Only prevent default if we're on a page with mini-cart
      if (window.location.pathname !== "/cart.html" && window.location.pathname !== "/checkout.html") {
        e.preventDefault()
        toggleMiniCart()
      }
    })
  })

  // Close mini-cart when clicking the close button
  const miniCartClose = document.getElementById("mini-cart-close")
  if (miniCartClose) {
    miniCartClose.addEventListener("click", () => {
      const miniCartContainer = document.getElementById("mini-cart-container")
      if (miniCartContainer) {
        miniCartContainer.classList.remove("show")
      }
    })
  }

  // Close mini-cart when clicking outside
  document.addEventListener("click", (e) => {
    const miniCartContainer = document.getElementById("mini-cart-container")
    const cartIcons = document.querySelectorAll('.nav-desktop a[href="cart.html"], .bottom-nav-item[href="cart.html"]')

    let clickedOnCartIcon = false
    cartIcons.forEach((icon) => {
      if (icon.contains(e.target)) {
        clickedOnCartIcon = true
      }
    })

    if (miniCartContainer && !miniCartContainer.contains(e.target) && !clickedOnCartIcon) {
      miniCartContainer.classList.remove("show")
    }
  })
})
