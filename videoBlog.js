const videoForm = document.getElementById("videoForm");
const videoPosts = document.getElementById("videoPosts");

// Load posts from localStorage on page load
window.onload = function () {
    const posts = JSON.parse(localStorage.getItem("videoPosts")) || [];
    posts.forEach((post) => renderPost(post));
};

videoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const profileImage = document.getElementById("profileImage").files[0];
    const subject = document.getElementById("subject").value;
    const description = document.getElementById("description").value;
    const videoUrl = document.getElementById("videoUrl").value;
    const videoFile = document.getElementById("videoFile").files[0];

    if (!videoUrl && !videoFile) {
        alert("Please provide a video URL or upload a video file.");
        return;
    }

    const postId = Math.random().toString(36).substr(2, 9); // Unique ID for each post
    const postTime = new Date().toLocaleString();

    const post = {
        id: postId,
        name,
        profileImage: URL.createObjectURL(profileImage),
        subject,
        description,
        videoUrl,
        videoFile: videoFile ? URL.createObjectURL(videoFile) : null,
        time: postTime,
        comments: [], // Initialize comments array
    };

    // Save post to localStorage
    savePost(post);
    renderPost(post);
    videoForm.reset();
});

function savePost(post) {
    const posts = JSON.parse(localStorage.getItem("videoPosts")) || [];
    posts.push(post);
    localStorage.setItem("videoPosts", JSON.stringify(posts));
}

function renderPost(post) {
    const postDiv = document.createElement("div");
    postDiv.id = post.id;
    postDiv.innerHTML = `
                <div class="post-header">
                    <img src="${post.profileImage
        }" alt="Profile" class="profile-img">
                    <div><strong>${post.name}</strong></div>
                </div>
                <div>
                    <h3>${post.subject}</h3>
                    <p>${post.description}</p>
                    <p><strong>Posted on:</strong> ${post.time}</p>
                </div>
                <video controls>
                    ${post.videoUrl
            ? `<source src="${post.videoUrl}" type="video/mp4">`
            : ""
        }
                    ${post.videoFile
            ? `<source src="${post.videoFile}" type="video/mp4">`
            : ""
        }
                    Your browser does not support the video tag.
                </video>
                <button class="delete-btn" onclick="deletePost('${post.id
        }')">Delete</button>
                <div class="comment-section" id="comments-${post.id}">
                    <h4>Comments</h4>
                    <div class="comments-list"></div>
                    <input type="text" placeholder="Your Name" id="commentName-${post.id
        }">
                    <input type="file" id="commentProfileImage-${post.id
        }" accept="image/*">
                    <textarea placeholder="Your Comment" id="commentText-${post.id
        }"></textarea>
                    <button onclick="addComment('${post.id}')">Comment</button>
                    <div class="show-less" onclick="toggleComments('${post.id
        }')">Show Less</div>
                </div>
            `;
    videoPosts.prepend(postDiv);

    // Load comments for the post
    post.comments.forEach((comment) => renderComment(post.id, comment));
}

function deletePost(postId) {
    const posts = JSON.parse(localStorage.getItem("videoPosts")) || [];
    const updatedPosts = posts.filter((post) => post.id !== postId);
    localStorage.setItem("videoPosts", JSON.stringify(updatedPosts));
    const postDiv = document.getElementById(postId);
    postDiv.remove();
}

function addComment(postId) {
    const commentName = document.getElementById(
        `commentName-${postId}`
    ).value;
    const commentProfileImage = document.getElementById(
        `commentProfileImage-${postId}`
    ).files[0];
    const commentText = document.getElementById(
        `commentText-${postId}`
    ).value;

    if (!commentText) {
        alert("Comment cannot be empty");
        return;
    }

    const comment = {
        name: commentName,
        profileImage: URL.createObjectURL(commentProfileImage),
        text: commentText,
    };

    // Save comment to localStorage
    saveComment(postId, comment);
    renderComment(postId, comment);

    // Clear input fields
    document.getElementById(`commentName-${postId}`).value = "";
    document.getElementById(`commentProfileImage-${postId}`).value = "";
    document.getElementById(`commentText-${postId}`).value = "";
}

function saveComment(postId, comment) {
    const posts = JSON.parse(localStorage.getItem("videoPosts")) || [];
    const post = posts.find((p) => p.id === postId);
    if (post) {
        post.comments.push(comment);
        localStorage.setItem("videoPosts", JSON.stringify(posts));
    }
}

function renderComment(postId, comment) {
    const commentDiv = document.createElement("div");
    commentDiv.className = "comment";
    commentDiv.innerHTML = `
                <strong>${comment.name}</strong> <img src="${comment.profileImage}" alt="Profile" class="profile-img">: ${comment.text}
            `;
    const commentsList = document.querySelector(
        `#comments-${postId} .comments-list`
    );
    commentsList.appendChild(commentDiv);
}

function toggleComments(postId) {
    const commentsList = document.querySelector(
        `#comments-${postId} .comments-list`
    );
    const comments = commentsList.children;
    const showMoreText = document.querySelector(
        `#comments-${postId} .show-less`
    );

    if (comments.length > 2) {
        for (let i = 2; i < comments.length; i++) {
            comments[i].style.display =
                comments[i].style.display === "none" ? "block" : "none";
        }
        showMoreText.innerText =
            showMoreText.innerText === "Show More" ? "Show Less" : "Show More";
    }
}