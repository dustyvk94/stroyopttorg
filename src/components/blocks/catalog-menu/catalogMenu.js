export function catalogMenu() {
  const nav = document.getElementById('category-nav')
  const title = nav.querySelector('.mobile-navigation__title')
  const backBtn = nav.querySelector('.mobile-navigation__button-back')

  const listFirst = nav.querySelector('.mobile-navigation__list--first')
  const listSecond = nav.querySelector('.mobile-navigation__list--second')
  const listLinks = nav.querySelector('.mobile-navigation__list--links')

  let historyStack = []
  let data = []

  fetch('data/categories.json')
    .then((res) => res.json())
    .then((json) => {
      data = json
      renderFirstLevel(data)
      resetMenu()
    })

  function renderFirstLevel(categories) {
    listFirst.innerHTML = ''
    categories.forEach((category) => {
      const btn = document.createElement('button')
      btn.className = 'mobile-navigation__button'
      btn.type = 'button'
      btn.textContent = category.name
      btn.addEventListener('click', () => {
        historyStack.push({ list: listFirst, title: 'Категории товара' })
        updateTitle(category.name)
        showBackButton(true)
        renderSecondLevel(category.subcategories)
        showList(listSecond)
      })

      const li = document.createElement('li')
      li.className = 'mobile-navigation__item'
      li.appendChild(btn)
      listFirst.appendChild(li)
    })
  }

  function renderSecondLevel(subcategories) {
    listSecond.innerHTML = ''
    subcategories.forEach((subcategory) => {
      const btn = document.createElement('button')
      btn.className = 'mobile-navigation__button'
      btn.type = 'button'
      btn.textContent = subcategory.name
      btn.addEventListener('click', () => {
        historyStack.push({ list: listSecond, title: title.textContent })
        updateTitle(subcategory.name)
        showBackButton(true)
        renderLinks(subcategory.products)
        showList(listLinks)
      })

      const li = document.createElement('li')
      li.className = 'mobile-navigation__item'
      li.appendChild(btn)
      listSecond.appendChild(li)
    })
  }

  function renderLinks(products) {
    listLinks.innerHTML = ''
    products.forEach((product) => {
      const a = document.createElement('a')
      a.className = 'mobile-navigation__link'
      a.href = product.url
      a.textContent = product.name

      const li = document.createElement('li')
      li.className = 'mobile-navigation__item'
      li.appendChild(a)
      listLinks.appendChild(li)
    })
  }

  backBtn.addEventListener('click', function () {
    if (historyStack.length === 0) return

    const previous = historyStack.pop()
    updateTitle(previous.title)
    showList(previous.list)

    if (historyStack.length === 0) {
      showBackButton(false)
    }
  })

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'class' && nav.classList.contains('open')) {
        resetMenu()
      }
    }
  })

  observer.observe(nav, { attributes: true })

  function updateTitle(text) {
    title.textContent = text
  }

  function showBackButton(show) {
    backBtn.classList.toggle('show', show)
  }

  function showList(targetList) {
    listFirst.style.display = 'none'
    listSecond.style.display = 'none'
    listLinks.style.display = 'none'
    targetList.style.display = 'block'
  }

  function resetMenu() {
    historyStack = []
    updateTitle('Категории товара')
    showList(listFirst)
    showBackButton(false)
  }
}
