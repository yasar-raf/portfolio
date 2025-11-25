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

    let currentFilter = 'all';

    // ===================================
    // Blog Posts Data
    // ===================================
    const allPosts = [
        {
            "id": 1,
            "title": "What You DON'T Need to Know as a Product Manager (That's OK)",
            "excerpt": "PMs sometimes feel pressure to understand every technical detail. You don't. Learn the balance between too little, too much, and just right technical knowledge for effective product management.",
            "content": "You don't need deep algorithms or system internals — just the high-level tech basics, what they solve, key trade-offs, and when to pull in engineering.\n\nWhat You DON'T Need to Know\n\nPMs sometimes feel pressure to understand every technical detail. You don't.\n\nYou can safely NOT know:\n• How to implement a binary search tree\n• The difference between O(n) and O(log n) complexity\n• How exactly a GPU processes tensor operations\n• The intricacies of memory management in C++\n• Exactly which AWS service to choose\n• How to write production code\n• Database indexing algorithms\n• Network protocol specifications\n\nWhat You DO Need to Know\n\nYou need to know enough to:\n• Ask intelligent questions\n• Understand what problems different technologies solve\n• Evaluate trade-offs (speed vs cost vs complexity)\n• Recognize when something is complex\n• Translate technical constraints to stakeholders\n• Know when to defer to engineering expertise\n\nThe Balance\n\nToo Little Technical Knowledge\n\nPM: \"Just make it work, I don't care how\"\n\nResult:\n• Engineers frustrated\n• Bad decisions made\n• No collaboration\n• Unrealistic expectations\n\nToo Much Technical Knowledge\n\nPM: \"Actually, we should use Kafka instead of RabbitMQ because of partition rebalancing...\"\n\nResult:\n• You're doing engineer's job\n• Neglecting PM responsibilities\n• Team unclear on roles\n• Decision paralysis\n\nJust Right Technical Knowledge\n\nPM: \"Help me understand the trade-offs so we can make the best decision for the product\"\n\nResult:\n• Collaborative decision-making\n• Clear roles\n• Informed choices\n• Mutual respect\n\nReal Example\n\nEngineer: \"We need to migrate to microservices\"\n\n❌ Too Little: \"What are microservices?\"\n\n❌ Too Much: \"Let's use event-driven architecture with CQRS and event sourcing...\"\n\n✅ Just Right: \"What problems with our current setup does this solve? What's the migration cost and risk? How does this affect our ability to ship features?\"\n\nAnother Example\n\nEngineer: \"The API is slow because of N+1 queries\"\n\n❌ Too Little: \"Just fix it\" (dismissive)\n\n❌ Too Much: \"We should implement eager loading with joins and add database indexes on foreign keys...\" (too technical)\n\n✅ Just Right: \"Help me understand: Is this a database issue or code issue? How many users are affected? Can we fix this incrementally or does it need a full rewrite?\"\n\nYour Role\n\nTrust engineers on: Implementation details, technology choices, architecture decisions\n\nLead the team on: Strategic direction, product priorities, customer problems, business trade-offs\n\nThe Bottom Line\n\nYour job is synthesis and decision-making, not technical implementation.\n\nKnow enough to be a good thought partner. Not enough to do their job.",
            "category": "product",
            "tags": ["Product Management", "Technical Knowledge", "Collaboration", "Leadership", "Engineering"],
            "author": "Yasar Arafath J",
            "authorRole": "Product Manager",
            "date": "2024-11-20",
            "readingTime": 7,
            "url": "#"
        }
    ];

    // ===================================
    // Load Blog Posts
    // ===================================
    function loadBlogPosts() {
        renderBlogPosts(allPosts);
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

            article.setAttribute('data-post-id', post.id);
            article.style.cursor = 'pointer';

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
                <span class="blog-card-link" aria-label="Read more about ${post.title}">
                    Read More
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </span>
            `;

            blogGrid.appendChild(article);
        });

        // Add click event listeners to blog cards
        const blogCards = document.querySelectorAll('.blog-card');
        blogCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const postId = parseInt(card.getAttribute('data-post-id'));
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
