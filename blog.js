/**
 * Yasar Arafath J - Blog Page
 * Dynamic blog post loading and filtering
 */

(function() {
    'use strict';

    // ===================================
    // DOM Elements
    // ===================================
    const blogGrid = document.getElementById('blog-grid');
    const emptyState = document.getElementById('empty-state');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let allPosts = [];
    let currentFilter = 'all';

    // ===================================
    // Load Blog Posts
    // ===================================
    async function loadBlogPosts() {
        try {
            const response = await fetch('blog-posts.json', {
                cache: 'no-cache'
            });
            if (!response.ok) {
                throw new Error('Failed to load blog posts');
            }
            allPosts = await response.json();
            renderBlogPosts(allPosts);
        } catch (error) {
            console.error('Error loading blog posts:', error);
            blogGrid.innerHTML = `
                <div class="error-state">
                    <p>Failed to load blog posts. Please try again later.</p>
                </div>
            `;
        }
    }

    // ===================================
    // Render Blog Posts
    // ===================================
    function renderBlogPosts(posts) {
        // Clear loading state
        blogGrid.innerHTML = '';

        if (posts.length === 0) {
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';

        posts.forEach((post, index) => {
            const article = document.createElement('article');
            article.className = 'blog-card reveal';
            article.style.transitionDelay = `${index * 0.1}s`;
            article.setAttribute('data-category', post.category);

            // Format date
            const postDate = new Date(post.date);
            const formattedDate = postDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Calculate reading time
            const readingTime = post.readingTime || calculateReadingTime(post.content);

            article.innerHTML = `
                <div class="blog-card-header">
                    <span class="blog-category">${getCategoryLabel(post.category)}</span>
                    <div class="blog-meta">
                        <span class="blog-date">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${formattedDate}
                        </span>
                        <span class="blog-reading-time">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                            ${readingTime} min read
                        </span>
                    </div>
                </div>
                <h2 class="blog-card-title">${post.title}</h2>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-footer">
                    <div class="blog-author">
                        <div class="blog-author-avatar">${post.author.charAt(0)}</div>
                        <div class="blog-author-info">
                            <span class="blog-author-name">${post.author}</span>
                            <span class="blog-author-role">${post.authorRole || 'Product Manager'}</span>
                        </div>
                    </div>
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <button class="blog-card-link" data-post-id="${post.id}" aria-label="Read more about ${post.title}">
                    Read More
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            `;

            blogGrid.appendChild(article);
        });

        // Add click event listeners to Read More buttons
        const readMoreButtons = document.querySelectorAll('.blog-card-link');
        readMoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(button.getAttribute('data-post-id'));
                const post = allPosts.find(p => p.id === postId);
                if (post) {
                    openPostModal(post);
                }
            });
        });

        // Trigger reveal animations
        setTimeout(() => {
            const cards = document.querySelectorAll('.blog-card');
            cards.forEach(card => card.classList.add('active'));
        }, 100);
    }

    // ===================================
    // Open Post Modal
    // ===================================
    function openPostModal(post) {
        // Format date
        const postDate = new Date(post.date);
        const formattedDate = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const readingTime = post.readingTime || calculateReadingTime(post.content);

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-overlay"></div>
            <div class="blog-modal-content">
                <button class="blog-modal-close" aria-label="Close modal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <article class="blog-post-full">
                    <div class="blog-post-header">
                        <span class="blog-category">${getCategoryLabel(post.category)}</span>
                        <h1 class="blog-post-title">${post.title}</h1>
                        <div class="blog-post-meta">
                            <div class="blog-author">
                                <div class="blog-author-avatar">${post.author.charAt(0)}</div>
                                <div class="blog-author-info">
                                    <span class="blog-author-name">${post.author}</span>
                                    <span class="blog-author-role">${post.authorRole || 'Product Manager'}</span>
                                </div>
                            </div>
                            <div class="blog-meta-details">
                                <span class="blog-date">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    ${formattedDate}
                                </span>
                                <span class="blog-reading-time">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                    </svg>
                                    ${readingTime} min read
                                </span>
                            </div>
                        </div>
                        <div class="blog-tags">
                            ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                    <div class="blog-post-content">
                        ${formatPostContent(post.content)}
                    </div>
                </article>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Add animations
        setTimeout(() => modal.classList.add('active'), 10);

        // Close modal events
        const closeBtn = modal.querySelector('.blog-modal-close');
        const overlay = modal.querySelector('.blog-modal-overlay');

        closeBtn.addEventListener('click', () => closeModal(modal));
        overlay.addEventListener('click', () => closeModal(modal));

        // Close on Escape key
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal(modal);
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // ===================================
    // Close Modal
    // ===================================
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => modal.remove(), 300);
    }

    // ===================================
    // Format Post Content
    // ===================================
    function formatPostContent(content) {
        // Convert line breaks to paragraphs
        const paragraphs = content.split('\n\n').filter(p => p.trim());
        return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    }

    // ===================================
    // Filter Blog Posts
    // ===================================
    function filterPosts(category) {
        currentFilter = category;

        // Update active button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active');
            }
        });

        // Filter posts
        const filteredPosts = category === 'all'
            ? allPosts
            : allPosts.filter(post => post.category === category);

        renderBlogPosts(filteredPosts);
    }

    // ===================================
    // Helper Functions
    // ===================================
    function getCategoryLabel(category) {
        const labels = {
            'ai': 'AI',
            'product': 'Product Management',
            'tech': 'Technology'
        };
        return labels[category] || category;
    }

    function calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    // ===================================
    // Event Listeners
    // ===================================
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterPosts(category);
        });
    });

    // ===================================
    // Initialize
    // ===================================
    window.addEventListener('load', () => {
        loadBlogPosts();
    });

})();
