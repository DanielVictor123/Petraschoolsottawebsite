let posts = JSON.parse(localStorage.getItem("posts")) || [];

function addPost() {
    const postContent = document.getElementById("newPost").value;
    const postName = document.getElementById("postName").value;
    const postPhoto = document.getElementById("postPhoto").files[0];
    const postDocument = document.getElementById("postDocument").files[0];
    const postVideo = document.getElementById("postVideo").files[0];
    const postCategory = document.getElementById("postCategory").value;
    const postDate = new Date().toLocaleDateString();

    if (postContent && postName && postCategory) {
        const post = {
            content: postContent,
            name: postName,
            date: postDate,
            category: postCategory,
            photo: null,
            document: null,
            video: null,
            tags: [],
            comments: [],
        };

        if (postPhoto) {
            const reader = new FileReader();
            reader.onload = function (event) {
                post.photo = event.target.result;
                savePost(post);
            };
            reader.readAsDataURL(postPhoto);
        } else if (postDocument) {
            post.document = URL.createObjectURL(postDocument);
            savePost(post);
        } else if (postVideo) {
            post.video = URL.createObjectURL(postVideo);
            savePost(post);
        } else {
            savePost(post);
        }
    } else {
        alert("Please fill in all fields.");
    }
}

function savePost(post) {
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
    document.getElementById("newPost").value = "";
    document.getElementById("postName").value = "";
    document.getElementById("postPhoto").value = "";
    document.getElementById("postDocument").value = "";
    document.getElementById("postVideo").value = "";
    document.getElementById("postCategory").value = "";
    renderPosts();
    updateCategoryCounts();
}

function renderComments(comments, postIndex, showAll) {
    const commentsToShow = showAll ? comments : comments.slice(0, 2);
    return commentsToShow
        .map(
            (comment, index) => `
                <div class="comment">
                    <div class="user-info">
                        <img src="${comment.photo}" alt="${comment.name}'s photo">
                        <strong>${comment.name}</strong> <em>${comment.date}</em>
                    </div>
                    <p>${comment.content}</p>
                    <button class="delete-button" onclick="deleteComment(${postIndex}, ${index})">Delete Comment</button>
                </div>
            `
        )
        .join("");
}

function renderPosts(filterPostsArray = posts) {
    const postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = "";

    if (filterPostsArray.length === 0) {
        postContainer.innerHTML =
            "<p>No posts available for this category.</p>";
    } else {
        filterPostsArray.forEach((post, index) => {
            const postDiv = document.createElement("div");
            postDiv.innerHTML = `
                        <div class="post">
                            <div class="user-info">
                                <img src="${post.photo || "default.jpg"
                }" alt="${post.name}'s photo">
                                <strong>${post.name}</strong> <em>${post.date
                }</em>
                            </div>
                            <p>${post.content}</p>
                            ${post.document
                    ? `<a href="${post.document}" target="_blank">View Document</a>`
                    : ""
                }
                            ${post.video
                    ? `<video width="320" height="240" controls><source src="${post.video}" type="video/mp4">Your browser does not support the video tag.</video>`
                    : ""
                }
                            <button class="delete-button" onclick="deletePost(${index})">Delete Post</button>
                            <div class="comments">
                                <h4>${post.comments.length} Comment${post.comments.length !== 1 ? "s" : ""
                } on this post</h4>
                                ${renderComments(
                    post.comments,
                    index,
                    post.comments.length <= 2
                )}
                                ${post.comments.length > 2
                    ? `<button onclick="toggleComments(${index})" id="toggle-btn-${index}">View All Comments</button>`
                    : ""
                }
                                <div class="comment-form">
                                    <input type="text" id="commenter-name-${index}" placeholder="Your Name" required>
                                    <input type="file" id="commenter-photo-${index}" accept="image/*" required>
                                    <textarea id="comment-text-${index}" placeholder="Your Comment" required></textarea>
                                    <button onclick="addComment(${index})">Submit Comment</button>
                                </div>
                            </div>
                        </div>
                    `;
            postContainer.appendChild(postDiv);
        });
    }
}

function toggleComments(postIndex) {
    const post = posts[postIndex];
    const commentsDiv = document.querySelector(
        `#postContainer .post:nth-child(${postIndex + 1}) .comments`
    );
    const toggleButton = document.getElementById(`toggle-btn-${postIndex}`);

    const isShowingAll = toggleButton.innerText === "View All Comments";
    commentsDiv.innerHTML = `
                <h4>${post.comments.length} Comment${post.comments.length !== 1 ? "s" : ""
        } on this post</h4>
                ${renderComments(post.comments, postIndex, isShowingAll)}
                <button onclick="toggleComments(${postIndex})" id="toggle-btn-${postIndex}">${isShowingAll ? "View Less Comments" : "View All Comments"
        }</button>
                <div class="comment-form">
                    <input type="text" id="commenter-name-${postIndex}" placeholder="Your Name" required>
                    <input type="file" id="commenter-photo-${postIndex}" accept="image/*" required>
                    <textarea id="comment-text-${postIndex}" placeholder="Your Comment" required></textarea>
                    <button onclick="addComment(${postIndex})">Submit Comment</button>
                </div>
            `;
}

function addComment(postIndex) {
    const name = document.getElementById(
        `commenter-name-${postIndex}`
    ).value;
    const photoFile = document.getElementById(
        `commenter-photo-${postIndex}`
    ).files[0];
    const content = document.getElementById(
        `comment-text-${postIndex}`
    ).value;
    const date = new Date().toLocaleDateString();

    if (name && photoFile && content) {
        const reader = new FileReader();
        reader.onload = function (event) {
            posts[postIndex].comments.push({
                name,
                photo: event.target.result,
                date,
                content,
            });
            localStorage.setItem("posts", JSON.stringify(posts)); // Save to localStorage
            renderPosts(); // Re-render posts to reflect changes
        };
        reader.readAsDataURL(photoFile);
    } else {
        alert("Please fill in all fields.");
    }
}

function deleteComment(postIndex, commentIndex) {
    posts[postIndex].comments.splice(commentIndex, 1);
    localStorage.setItem("posts", JSON.stringify(posts)); // Update local storage
    renderPosts(); // Re-render posts to reflect changes
}

function deletePost(postIndex) {
    posts.splice(postIndex, 1);
    localStorage.setItem("posts", JSON.stringify(posts)); // Update local storage
    renderPosts(); // Re-render posts to reflect changes
}

function updateCategoryCounts() {
    const categoryList = document.getElementById("categoryList");
    categoryList.innerHTML = ""; // Clear existing categories

    const categories = [
        { name: "Coding Boot-camp", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/codingbootcamp/Coding_bootcamp.webp" },
        { name: "Admission", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/Images/Petra Schools Logo.webp" },
        { name: "Summer Holiday Coaching", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/codingbootcamp/Summer Holiday - Copy.webp" },
        { name: "Technology", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/codingbootcamp/Coding_bootcamp.webp" },
        { name: "Socials", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/codingbootcamp/about-video.webp" },
        { name: "Politics", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/codingbootcamp/politicians-in-Nigeria.jpg" },
        { name: "Sports", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/petra_images/EXCURSSION/_MG_1611 copy.webp" },
        { name: "Petra News", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/codingbootcamp/bootcamp3.webp" },
        { name: "Excursions", img: "https://danielvictor123.github.io/Petraschoolsottawebsite/petra_images/EXCURSSION/_MG_1861 copy.webp" },
    ];

    categories.forEach((category) => {
        const count = posts.filter(
            (post) => post.category === category.name
        ).length;
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category-item";
        categoryDiv.onclick = () => filterPosts(category.name);
        categoryDiv.innerHTML = `
        <img src="${category.img}" alt="${category.name}" class="category-image" />
        <span class="category-name">${category.name} (${count})</span>
      `;
        categoryList.appendChild(categoryDiv);
    });
}



function filterPosts(category) {
    const filteredPosts = category
        ? posts.filter((post) => post.category === category)
        : posts;
    renderPosts(filteredPosts);
}

function searchPosts() {
    const query = document.getElementById("search").value.toLowerCase();
    const filteredPosts = posts.filter(
        (post) =>
            post.content.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query) ||
            (post.tags &&
                post.tags.some((tag) => tag.toLowerCase().includes(query)))
    );
    renderPosts(filteredPosts.length > 0 ? filteredPosts : []);
}

window.onload = function () {
    renderPosts();
    updateCategoryCounts(); // Initialize category counts on load
};
