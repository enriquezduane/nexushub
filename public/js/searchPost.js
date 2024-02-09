function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('query');
}

function searchPosts(query) {
    const posts = [
        {   id: 1, 
            title: "NexusHub Forum Upgraded", 
            poster: "lokitrickster",
            date: "Jan 30, 2024, 10:45 PM",
            titleRef: "post-1.html",
            posterRef: "profile-1.html"
        },

        {   id: 2, 
            title: "Forum Rules", 
            poster: "Joshua",
            date: "Jan 20, 2024, 08:54 PM",
            titleRef: "post-2.html",
            posterRef: "profile-2.html"
        },  

        {   id: 3, 
            title: "Server Roles", 
            poster: "lokitrickster",
            date: "Jan 20, 2024, 05:27 PM",
            titleRef: "post-3.html",
            posterRef: "profile-1.html"
        },

        {   id: 4, 
            title: "Getting Started: A Beginner's Guide to NexusHub", 
            poster: "Duane",
            date: "Jan 20, 2024, 03:51 PM",
            titleRef: "post-4.html",
            posterRef: "profile-3.html"
        },

        {   id: 5, 
            title: "Can we get a light mode, please?", 
            poster: "LightYagami",
            date: "Jan 28, 2024, 08:30 AM",
            titleRef: "post-5.html",
            posterRef: "profile-4.html"
        },

        {   id: 6, 
            title: "Why does the MVP always spawn when I'm AFK?!", 
            poster: "GrumpyMage",
            date: "Jan 28, 2024, 11:59 PM",
            titleRef: "post-6.html",
            posterRef: "profile-5.html"
        },  

        {   id: 7, 
            title: "Frozen Ragnarok Online (HighRate)", 
            poster: "frozenDev",
            date: "Feb 01, 2024, 03:15 PM",
            titleRef: "post-7.html",
            posterRef: "profile-6.html"
        },

        {   id: 8, 
            title: "HiraniRO 5x5x5x", 
            poster: "EternalWanderer",
            date: "Feb 02, 2024, 07:20 PM",
            titleRef: "post-8.html",
            posterRef: "profile-7.html"
        },

        {   id: 9, 
            title: "Ragnarok Mobile vs. Ragnarok Online - Thoughts?", 
            poster: "CrossPlatformer",
            date: "Feb 02, 2024, 09:00 AM",
            titleRef: "post-9.html",
            posterRef: "profile-8.html"
        },

        {   id: 10, 
            title: "Assassin Cross vs Sniper, which is better for PvP?", 
            poster: "ShadowDuelist",
            date: "Feb 01, 2024, 05:45 PM",
            titleRef: "post-10.html",
            posterRef: "profile-9.html"
        },  

        {   id: 11, 
            title: "Getting your first job: A Beginner's Guide to Ragnarok Online", 
            poster: "lokitrickster",
            date: "Jan 29, 2024, 04:42 PM",
            titleRef: "post-11.html",
            posterRef: "profile-1.html"
        },

        {   id: 12, 
            title: "Ultimate Guide to Zeny Farming 2024 Edition", 
            poster: "ZenyMaster",
            date: "Jan 31, 2024, 12:30 PM",
            titleRef: "post-12.html",
            posterRef: "profile-10.html"
        }
    ];

    const searchResults = posts.filter(post => {
        return post.title.toLowerCase().includes(query.toLowerCase());
    });

    // Display search results
    const searchResultsContainer = document.querySelector('.content-container');
    const searchResultsBottom = document.querySelector('.reply-section-top');

    if (searchResults.length > 0) {
        searchResults.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'search-result-container post-section post-container-template';
            postElement.style.fontWeight = 'normal';
            postElement.innerHTML = `
                <div class="search-result-content">
                    <a href="${post.titleRef}">
                        ${post.title}
                    </a>
                    <span>
                        <strong>#${index + 1}</strong>
                    </span>
                </div>
                <p>
                    ${post.date} by <a href="${post.posterRef}">${post.poster}</a>
                </p>
            `;
            searchResultsContainer.insertBefore(postElement, searchResultsBottom);
        });
    } else {
        const postElement = document.createElement('div');
        postElement.className = 'search-result-container post-section post-container-template';
        postElement.style.display = 'block';
        postElement.style.color = '#FFF';
        postElement.innerHTML = `No results found for <strong>${query}</strong>.`;
        searchResultsContainer.insertBefore(postElement, searchResultsBottom);
    }
}

const query = getSearchQuery();
searchPosts(query);