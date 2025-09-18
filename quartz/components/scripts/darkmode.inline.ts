const userPref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
const currentTheme = localStorage.getItem("theme") ?? userPref
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

document.addEventListener("nav", () => {
  const switchTheme = () => {
    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const themeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? "dark" : "light"
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const updateCheckboxState = () => {
    const currentTheme = document.documentElement.getAttribute("saved-theme")
    const checkboxes = document.querySelectorAll(".darkmode-checkbox") as NodeListOf<HTMLInputElement>
    checkboxes.forEach(checkbox => {
      checkbox.checked = currentTheme === "dark"
    })
  }

  // Initialize checkbox state
  updateCheckboxState()

  // Handle checkbox changes
  for (const darkmodeSwitch of document.getElementsByClassName("darkmode-switch")) {
    const checkbox = darkmodeSwitch.querySelector(".darkmode-checkbox") as HTMLInputElement
    if (checkbox) {
      checkbox.addEventListener("change", switchTheme)
      window.addCleanup(() => checkbox.removeEventListener("change", switchTheme))
    }
  }

  // Listen for changes in prefers-color-scheme
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", (e) => {
    themeChange(e)
    updateCheckboxState()
  })
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))
})
