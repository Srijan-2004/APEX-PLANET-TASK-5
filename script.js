// Lazy Loading Implementation
class LazyLoader {
  constructor() {
    this.imageObserver = null
    this.init()
  }

  init() {
    // Check if Intersection Observer is supported
    if ("IntersectionObserver" in window) {
      this.imageObserver = new IntersectionObserver(this.onIntersection.bind(this), {
        rootMargin: "50px 0px",
        threshold: 0.01,
      })

      this.observeImages()
    } else {
      // Fallback for older browsers
      this.loadAllImages()
    }
  }

  observeImages() {
    const lazyImages = document.querySelectorAll(".lazy-image[data-src]")
    lazyImages.forEach((img) => {
      this.imageObserver.observe(img)
    })
  }

  onIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target)
        this.imageObserver.unobserve(entry.target)
      }
    })
  }

  loadImage(img) {
    // Show loading spinner
    img.classList.add("loading")
    img.innerHTML = '<div class="loading-spinner"></div>'

    const imageLoader = new Image()
    imageLoader.crossOrigin = "anonymous"

    imageLoader.onload = () => {
      img.src = img.dataset.src
      img.classList.remove("loading")
      img.classList.add("loaded")
      img.innerHTML = ""
      img.removeAttribute("data-src")
    }

    imageLoader.onerror = () => {
      img.classList.remove("loading")
      img.innerHTML = '<div style="color: #666;">Failed to load image</div>'
    }

    imageLoader.src = img.dataset.src
  }

  loadAllImages() {
    const lazyImages = document.querySelectorAll(".lazy-image[data-src]")
    lazyImages.forEach((img) => {
      this.loadImage(img)
    })
  }
}

// Scroll Animation Handler
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll(".fade-in")
    this.init()
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      })

      this.animatedElements.forEach((el) => {
        this.observer.observe(el)
      })
    } else {
      // Fallback for older browsers
      this.animatedElements.forEach((el) => {
        el.classList.add("visible")
      })
    }
  }

  onIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        this.observer.unobserve(entry.target)
      }
    })
  }
}

// Navigation Handler
class Navigation {
  constructor() {
    this.navbar = document.getElementById("navbar")
    this.mobileToggle = document.getElementById("mobile-menu-toggle")
    this.navMenu = document.getElementById("nav-menu")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.init()
  }

  init() {
    // Scroll event for navbar
    let ticking = false
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll()
          ticking = false
        })
        ticking = true
      }
    })

    // Mobile menu toggle
    this.mobileToggle.addEventListener("click", this.toggleMobileMenu.bind(this))

    // Close mobile menu when clicking on links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu()
      })
    })

    // Smooth scrolling for navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", this.smoothScroll.bind(this))
    })
  }

  handleScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add("scrolled")
    } else {
      this.navbar.classList.remove("scrolled")
    }
  }

  toggleMobileMenu() {
    this.mobileToggle.classList.toggle("active")
    this.navMenu.classList.toggle("active")
  }

  closeMobileMenu() {
    this.mobileToggle.classList.remove("active")
    this.navMenu.classList.remove("active")
  }

  smoothScroll(e) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href")
    const targetSection = document.querySelector(targetId)

    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 70 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }
}

// Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form")
    this.init()
  }

  init() {
    this.form.addEventListener("submit", this.handleSubmit.bind(this))
  }

  async handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(this.form)
    const data = Object.fromEntries(formData)

    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.textContent = "Sending..."
    submitBtn.disabled = true

    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message
      this.showMessage("Message sent successfully!", "success")
      this.form.reset()
    } catch (error) {
      // Show error message
      this.showMessage("Failed to send message. Please try again.", "error")
    } finally {
      // Reset button
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }
  }

  showMessage(message, type) {
    // Create and show message element
    const messageEl = document.createElement("div")
    messageEl.textContent = message
    messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            background: ${type === "success" ? "#10b981" : "#ef4444"};
        `

    document.body.appendChild(messageEl)

    // Remove message after 5 seconds
    setTimeout(() => {
      messageEl.style.animation = "slideOutRight 0.3s ease-out"
      setTimeout(() => {
        document.body.removeChild(messageEl)
      }, 300)
    }, 5000)
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init()
  }

  init() {
    // Preload critical resources
    this.preloadCriticalResources()

    // Optimize images
    this.optimizeImages()

    // Add performance monitoring
    this.monitorPerformance()
  }

  preloadCriticalResources() {
    // Preload hero image
    const heroImage = document.querySelector(".hero-image img")
    if (heroImage && heroImage.dataset.src) {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = heroImage.dataset.src
      document.head.appendChild(link)
    }
  }

  optimizeImages() {
    // Add will-change property to images that will be animated
    const animatedImages = document.querySelectorAll(".hero-image img, .project-image img")
    animatedImages.forEach((img) => {
      img.classList.add("will-change")
    })
  }

  monitorPerformance() {
    // Monitor Core Web Vitals
    if ("web-vital" in window) {
      // This would integrate with actual web vitals library
      console.log("Performance monitoring initialized")
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  new LazyLoader()
  new ScrollAnimations()
  new Navigation()
  new ContactForm()
  new PerformanceOptimizer()

  console.log("Portfolio website initialized successfully!")
})

// Service Worker for caching (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
