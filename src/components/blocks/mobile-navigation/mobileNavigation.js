export function mobileNavigation(trigger, menuId) {
  const page = document.documentElement
  const buttonOpen = document.querySelector(trigger)
  const mobileNavigation = document.querySelector(menuId)

  let focusableElements = []
  let firstFocusable = null
  let lastFocusable = null

  buttonOpen.addEventListener('click', toggleMenu)
  mobileNavigation.addEventListener('click', closeMenu)

  function toggleMenu() {
    const isOpen = mobileNavigation.classList.toggle('open')
    page.classList.toggle('page--lock', isOpen)
    buttonOpen.setAttribute('aria-expanded', isOpen)
    mobileNavigation.toggleAttribute('inert', !isOpen)

    if (isOpen) {
      focusableElements = mobileNavigation.querySelectorAll(
        'a, button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable = focusableElements[0]
      lastFocusable = focusableElements[focusableElements.length - 1]

      if (firstFocusable) firstFocusable.focus()

      document.addEventListener('keydown', trapFocus)
    } else {
      document.removeEventListener('keydown', trapFocus)
    }
  }

  function setAttributeCloseMenu() {
    page.classList.remove('page--lock')
    buttonOpen.setAttribute('aria-expanded', 'false')
    mobileNavigation.setAttribute('inert', '')
    mobileNavigation.classList.remove('open')
    buttonOpen.focus()
    document.removeEventListener('keydown', trapFocus)
  }

  function closeMenu(event) {
    const target = event.target

    if (
      target.classList.contains('mobile-navigation__overlay') ||
      target.classList.contains('mobile-navigation__close') ||
      target.closest('a') ||
      target.closest('.header-top__order-call')
    ) {
      setAttributeCloseMenu()
    }
  }

  function trapFocus(event) {
    if (event.key === 'Escape') {
      setAttributeCloseMenu()
      return
    }

    if (event.key !== 'Tab') return

    const isShift = event.shiftKey

    if (isShift && document.activeElement === firstFocusable) {
      event.preventDefault()
      lastFocusable.focus()
    } else if (!isShift && document.activeElement === lastFocusable) {
      event.preventDefault()
      firstFocusable.focus()
    }
  }
}
