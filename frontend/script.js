document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const generateBtn = document.getElementById("generateBtn")
  const copyBtn = document.getElementById("copyBtn")
  const clearBtn = document.getElementById("clearBtn")
  const resultContainer = document.getElementById("resultContainer")
  const topicInput = document.getElementById("topic")
  const toneSelect = document.getElementById("tone")
  const postContent = document.getElementById("postContent")
  const toneBadge = document.getElementById("toneBadge")
  const toast = document.getElementById("toast")
  const toastTitle = document.getElementById("toastTitle")
  const toastDesc = document.getElementById("toastDesc")
  const toastIcon = document.getElementById("toastIcon")

  // API Configuration
  const API_ENDPOINT = "https://linkedingenerator.onrender.com/generate"

  // Toast notification system
  function showToast(title, message, type = "info") {
    toastTitle.textContent = title
    toastDesc.textContent = message

    // Reset classes
    toast.className = "toast"

    // Set icon and type-specific styling
    switch (type) {
      case "success":
        toast.classList.add("success")
        toastIcon.className = "toast-icon fas fa-check-circle"
        break
      case "error":
        toast.classList.add("error")
        toastIcon.className = "toast-icon fas fa-exclamation-circle"
        break
      default:
        toastIcon.className = "toast-icon fas fa-info-circle"
    }

    // Show toast
    toast.classList.remove("hidden")

    // Auto-hide after 4 seconds
    setTimeout(() => {
      toast.classList.add("hidden")
    }, 4000)
  }

  // Update button loading state
  function setLoadingState(isLoading) {
    if (isLoading) {
      generateBtn.disabled = true
      generateBtn.classList.add("loading")
      generateBtn.innerHTML = '<span style="margin-left: 2rem;">Generating Your Post...</span>'
    } else {
      generateBtn.disabled = false
      generateBtn.classList.remove("loading")
      generateBtn.innerHTML = '<i class="fas fa-magic"></i><span>Generate LinkedIn Post</span>'
    }
  }

  // Generate LinkedIn post
  async function generatePost() {
    const topic = topicInput.value.trim()
    const tone = toneSelect.value

    // Validation
    if (!topic) {
      showToast("Topic Required", "Please enter a topic for your LinkedIn post.", "error")
      topicInput.focus()
      return
    }

    if (topic.length < 3) {
      showToast("Topic Too Short", "Please enter a more descriptive topic (at least 3 characters).", "error")
      topicInput.focus()
      return
    }

    try {
      setLoadingState(true)

      console.log("Generating post with:", { topic, tone })

      // API call with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, tone }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.post) {
        throw new Error("No post content received from server")
      }

      // Update UI with generated content
      postContent.textContent = data.post
      toneBadge.textContent = tone
      toneBadge.className = `tone-badge ${tone.toLowerCase()}`

      // Show result container with smooth animation
      resultContainer.classList.remove("hidden")

      // Scroll to result
      setTimeout(() => {
        resultContainer.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)

      showToast("Success!", "Your LinkedIn post has been generated successfully.", "success")
    } catch (error) {
      console.error("Generation error:", error)

      let errorMessage = "Failed to generate post. Please try again."

      if (error.name === "AbortError") {
        errorMessage = "Request timed out. Please check your connection and try again."
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection."
      } else if (error.message) {
        errorMessage = error.message
      }

      showToast("Generation Failed", errorMessage, "error")
    } finally {
      setLoadingState(false)
    }
  }

  // Copy post to clipboard
  async function copyToClipboard() {
    const content = postContent.textContent

    if (!content) {
      showToast("Nothing to Copy", "Generate a post first before copying.", "error")
      return
    }

    try {
      await navigator.clipboard.writeText(content)

      // Update button state
      const originalHTML = copyBtn.innerHTML
      copyBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>'
      copyBtn.classList.add("copied")

      showToast("Copied!", "Post copied to clipboard successfully.", "success")

      // Reset button after 2 seconds
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML
        copyBtn.classList.remove("copied")
      }, 2000)
    } catch (error) {
      console.error("Copy error:", error)

      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea")
        textArea.value = content
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)

        showToast("Copied!", "Post copied to clipboard successfully.", "success")
      } catch (fallbackError) {
        showToast("Copy Failed", "Unable to copy to clipboard. Please copy manually.", "error")
      }
    }
  }

  // Clear form and results
  function clearPost() {
    topicInput.value = ""
    toneSelect.value = "Professional"
    resultContainer.classList.add("hidden")
    postContent.textContent = ""
    toneBadge.textContent = "Professional"
    toneBadge.className = "tone-badge professional"

    // Focus on topic input
    topicInput.focus()

    showToast("Cleared", "Form cleared. Ready for a new post!", "info")
  }

  // Event Listeners
  generateBtn.addEventListener("click", generatePost)
  copyBtn.addEventListener("click", copyToClipboard)
  clearBtn.addEventListener("click", clearPost)

  // Enter key support for topic input
  topicInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !generateBtn.disabled) {
      e.preventDefault()
      generatePost()
    }
  })

  // Input validation feedback
  topicInput.addEventListener("input", () => {
    const value = topicInput.value.trim()
    if (value.length > 0 && value.length < 3) {
      topicInput.style.borderColor = "#ef4444"
    } else {
      topicInput.style.borderColor = ""
    }
  })

  // Auto-focus on topic input when page loads
  topicInput.focus()

  // Handle toast click to dismiss
  toast.addEventListener("click", () => {
    toast.classList.add("hidden")
  })

  // Keyboard accessibility for toast
  toast.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toast.classList.add("hidden")
    }
  })
})
