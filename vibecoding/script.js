document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('nav-container');
    const contentContainer = document.getElementById('content');
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobileToggle');

    let allArticles = []; // Flat list for easier searching and navigation

    // Search Input Creation
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'ძიება...';
    searchInput.className = 'search-input';
    document.querySelector('.brand').after(searchInput);

    // Toggle Sidebar on Mobile
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Check if contentData is loaded (from data.js)
    if (typeof contentData !== 'undefined') {
        flattenArticles(contentData);
        renderNavigation(contentData);
        // Load the first article by default
        if (allArticles.length > 0) {
            loadArticle(allArticles[0]);
        }
    } else {
        console.error('Error: contentData is not defined.');
        contentContainer.innerHTML = '<h1>შეცდომა</h1><p>ვერ მოხერხდა კონტენტის ჩატვირთვა. სავარაუდოდ, data.js ფაილი დაზიანებულია ან არ არსებობს.</p>';
    }

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.nav-item');
        const categories = document.querySelectorAll('.nav-category');

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const parentCat = item.closest('.nav-category');

            if (text.includes(term)) {
                item.style.display = 'block';
                // Highlight match? (Optional optimization)
            } else {
                item.style.display = 'none';
            }
        });

        // Hide empty categories
        categories.forEach(cat => {
            const visibleItems = cat.querySelectorAll('.nav-item[style="display: block"]');
            const allItems = cat.querySelectorAll('.nav-item');

            // If term is empty, show everything
            if (term === '') {
                cat.style.display = 'block';
                allItems.forEach(i => i.style.display = 'block');
            } else {
                if (visibleItems.length > 0) {
                    cat.style.display = 'block';
                } else {
                    cat.style.display = 'none';
                }
            }
        });
    });

    function flattenArticles(data) {
        data.categories.forEach(category => {
            category.articles.forEach(article => {
                // Add category title for context if needed
                article.category = category.title;
                allArticles.push(article);
            });
        });
    }

    function renderNavigation(data) {
        navContainer.innerHTML = '';

        data.categories.forEach(category => {
            const catDiv = document.createElement('div');
            catDiv.className = 'nav-category';

            const catTitle = document.createElement('div');
            catTitle.className = 'nav-category-title';
            catTitle.textContent = category.title;
            catDiv.appendChild(catTitle);

            category.articles.forEach(article => {
                const link = document.createElement('a');
                link.className = 'nav-item';
                link.href = '#';
                link.textContent = article.title;
                link.dataset.title = article.title; // For identification
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    setActiveArticle(article);
                    // Close sidebar on mobile
                    sidebar.classList.remove('open');
                });
                catDiv.appendChild(link);
            });

            navContainer.appendChild(catDiv);
        });
    }

    function setActiveArticle(article) {
        // Update Active State
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        // Find the link corresponding to this article
        const activeLink = document.querySelector(`.nav-item[data-title="${article.title}"]`);
        if (activeLink) activeLink.classList.add('active');

        loadArticle(article);
    }

    function loadArticle(article) {
        // Simple Markdown Rendering using 'marked' library (loaded in HTML)
        let html = marked.parse(article.content);

        // Inject HTML
        contentContainer.innerHTML = html;

        // Syntax Highlight
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });

        // Add Copy Buttons
        addCopyButtons();

        // Add Navigation Buttons (Next/Prev)
        addNavButtons(article);

        // Scroll to top
        contentContainer.scrollTop = 0;
        document.querySelector('.main-content').scrollTop = 0;
    }

    function addCopyButtons() {
        document.querySelectorAll('pre').forEach(pre => {
            // Check if button already exists (in case of re-renders)
            if (pre.querySelector('.copy-btn')) return;

            const button = document.createElement('button');
            button.className = 'copy-btn';
            button.textContent = 'კოპირება';

            button.addEventListener('click', () => {
                const code = pre.querySelector('code').innerText;
                navigator.clipboard.writeText(code).then(() => {
                    button.textContent = 'დაკოპირდა!';
                    setTimeout(() => {
                        button.textContent = 'კოპირება';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    button.textContent = 'შეცდომა';
                });
            });

            pre.appendChild(button);
        });
    }

    function addNavButtons(currentArticle) {
        const index = allArticles.findIndex(a => a === currentArticle);
        const navDiv = document.createElement('div');
        navDiv.className = 'article-nav';

        if (index > 0) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'nav-btn prev';
            prevBtn.innerHTML = `&larr; ${allArticles[index - 1].title}`;
            prevBtn.onclick = () => setActiveArticle(allArticles[index - 1]);
            navDiv.appendChild(prevBtn);
        }

        if (index < allArticles.length - 1) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'nav-btn next';
            nextBtn.innerHTML = `${allArticles[index + 1].title} &rarr;`;
            nextBtn.onclick = () => setActiveArticle(allArticles[index + 1]);
            navDiv.appendChild(nextBtn);
        }

        contentContainer.appendChild(navDiv);
    }
});
