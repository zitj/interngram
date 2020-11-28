const id = new URLSearchParams(window.location.search).get('id');
const body = document.querySelector('body');

const container = document.querySelector('.container');
const formPanel = document.querySelector('.formPanel');
const darkBackground = document.querySelector('.darkBackground');
const form = document.querySelector('form');
const editForm = document.getElementById('editForm');
const editFormHeading = formPanel.querySelector('h1');
const editFormBtn = formPanel.querySelector('button');
const title = document.getElementById('title');
const type = document.getElementById('type');
const content = document.getElementById('content');

const logo = document.querySelector('.logo');
const closeBtn = document.querySelector('.closeBtn');
const userBtn = document.querySelector('.userBtn');
let avatar = document.querySelector('.avatar');
const deleteBtn = document.querySelector('.delete');
const editBtn = document.querySelector('.edit');

const commentSection = document.querySelector('.commentSection');
const commentsContainer = document.querySelector('.comments');
const commentForm = document.querySelector('.commentForm');
const commentContent = document.getElementById('comment');
const commentHeading = commentSection.querySelector('h3');
const commentButton = commentForm.querySelector('button');
const commentTextArea = commentForm.querySelector('textarea');

const likeAndBookmarkContainer = document.querySelector('.likeAndBookmark');
const likeBtn = document.querySelector('.like');
const bookmarkBtn = document.querySelector('.bookmark');

const titleLabel = document.getElementById('titleLabel');
const typeLabel = document.getElementById('typeLabel');
const contentLabel = document.getElementById('contentLabel');
const imageLabel = document.getElementById('imageLabel');
const videoLabel = document.getElementById('videoLabel');
const linkLabel = document.getElementById('linkLabel');

let userSignedIn = {};
let activePost = {};
let userLanguage;

const loadUser = async () => {
    const res = await fetch(
        `http://localhost:3000/users/` + localStorage.getItem('userID')
    );
    const user = await res.json();

    userBtn.innerHTML = user.firstName + ' ' + user.lastName;
    avatar.src = user.avatar;

    body.classList.add(`${user.themeColor}`);

    userSignedIn = user;
};

const updateLanguage = async () => {
    await loadUser();
    let uri = `http://localhost:3000/languages`;
    const res = await fetch(uri);
    const languages = await res.json();
    languages.forEach((language) => {
        if (language.language == userSignedIn.language) {
            userLanguage = language;
        }
    });

    editBtn.innerHTML = `${userLanguage.edit}`;
    deleteBtn.innerHTML = `${userLanguage.delete}`;
    commentHeading.innerHTML = `${userLanguage.comments}`;
    commentButton.innerHTML = `${userLanguage.submit}`;
    commentTextArea.placeholder = `${userLanguage.writeYourComment}`;
    editFormHeading.innerHTML = `${userLanguage.editPost}`;
    editFormBtn.innerHTML = `${userLanguage.editPost}`;
    titleLabel.innerHTML = `${userLanguage.titleOfThePost}`;
    typeLabel.innerHTML = `${userLanguage.typeOfThePost}`;
    contentLabel.innerHTML = `${userLanguage.contentOfThePost}`;
    imageLabel.innerHTML = `${userLanguage.image}`;
    videoLabel.innerHTML = `${userLanguage.video}`;
    linkLabel.innerHTML = `${userLanguage.link}`;
};

const renderIndividualPost = async () => {
    await updateLanguage();
    const res = await fetch('http://localhost:3000/posts/' + id);
    const post = await res.json();
    let template = '';
    activePost = post;
    if (post.type === 'IMAGE') {
        template = `
        <h1>${post.title}</h1>
        <img src="${post.meta.url}" alt="">
      `;
        likeAndBookmarkContainer.children[1].innerHTML = `Created by: ${post.userName}`;
    }
    if (post.type === 'VIDEO') {
        if (post.meta.url.split('=') && post.meta.url.split('&')) {
            let link = post.meta.url.split('=');
            let linkID = link[1].split('&');
            let linkIdEmbed = linkID[0];

            template = `
        <h1>${post.title}</h1>
        <iframe id="ytplayer" type="text/html"
        frameborder="0" src='https://www.youtube.com/embed/${linkIdEmbed}'></iframe>
    
      `;
            likeAndBookmarkContainer.children[1].innerHTML = `${userLanguage.createdBy}: ${post.userName}`;
        }
    }
    if (post.type === 'LINK') {
        template = `
        <h1>${post.title}</h1>
        <a class='postLink' href="${post.meta.url}">${post.meta.url}</a>
 
      `;
        likeAndBookmarkContainer.children[1].innerHTML = `Created by: ${post.userName}`;
    }
    container.innerHTML = template;
};

const renderComments = async () => {
    const res = await fetch('http://localhost:3000/comments/');
    const comments = await res.json();
    let template = '';
    comments.forEach((comment) => {
        if (comment.postId == id) {
            template += `
      <div class="comment">
      <div class="user">
      <img src=${comment.userAvatar} alt=${comment.userName}>
      <p>${comment.userName}</p>
      </div>
      <p class="usersComment">${comment.content}</p>
      
      </div>
      `;
            console.log(comment);
        }
    });
    commentsContainer.innerHTML = template;
};

//Submit comment
const submitComment = async (e) => {
    e.preventDefault();
    const doc = {
        userId: userSignedIn.id,
        userName: userSignedIn.firstName + ' ' + userSignedIn.lastName,
        userAvatar: userSignedIn.avatar,
        postId: activePost.id,
        content: commentContent.value,
    };
    await fetch('http://localhost:3000/comments/', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' },
    });
    window.location.reload(`post.html?=${id}`);
};

//Edit post & Delete post
const changePost = async (e) => {
    e.preventDefault();
    const doc = {
        title: title.value,
        type: type.value,
        meta: {
            url: content.value,
        },
    };
    await fetch('http://localhost:3000/posts/' + id, {
        method: 'PATCH',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' },
    });
    window.location.reload(`post.html?=${id}`);
};

//Delete button option
if (!userSignedIn) {
    deleteBtn.addEventListener('click', async (e) => {
        const res = await fetch('http://localhost:3000/posts/' + id, {
            method: 'DELETE',
        });
        window.location.replace(`main.html`);
    });
}

deleteBtn.addEventListener('click', async (e) => {
    const res = await fetch('http://localhost:3000/posts/' + id, {
        method: 'DELETE',
    });
    window.location.replace(`main.html?id=${userSignedIn.id}`);
});

//Edit button option
const uploadInputs = () => {
    title.value = activePost.title;
    type.value = activePost.type;
    content.value = activePost.meta.url;
};

editBtn.addEventListener('click', () => {
    if (!userSignedIn || activePost.userId == userSignedIn.id) {
        formPanel.classList.add('active');
        darkBackground.classList.add('active');
        uploadInputs();
    } else {
        alert(
            'Sorry, you can not edit the post that is created by someone else.'
        );
    }
});

const panelRemover = () => {
    formPanel.classList.remove('active');
    darkBackground.classList.remove('active');
};
closeBtn.addEventListener('click', () => {
    panelRemover();
});
darkBackground.addEventListener('click', () => {
    panelRemover();
});

editForm.addEventListener('submit', changePost);
commentForm.addEventListener('submit', submitComment);

// LIKE POST FEATURE
const usersWhoLikedArray = async () => {
    await renderIndividualPost();
    await loadUser();
    for (i = 0; i <= activePost.usersWhoLiked.length; i++) {
        if (activePost.usersWhoLiked[i] == userSignedIn.id) {
            likeBtn.classList.add('active');
        }
    }
};

const removeFromAnAray = (arr, item) => {
    for (var i = arr.length; i--; ) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        }
    }
};

const isThePostLiked = async (e) => {
    const res = await renderIndividualPost();
    if (likeBtn.classList.contains('active')) {
        activePost.usersWhoLiked.push(userSignedIn.id);
        activePost.usersWhoLiked = [...new Set(activePost.usersWhoLiked)];
        await fetch('http://localhost:3000/posts/' + activePost.id, {
            method: 'PATCH',
            body: JSON.stringify(activePost),
            headers: { 'Content-Type': 'application/json' },
        });
        window.location.replace(`main.html?id=${userSignedIn.id}`);
    }

    if (!likeBtn.classList.contains('active')) {
        removeFromAnAray(activePost.usersWhoLiked, userSignedIn.id);
        await fetch('http://localhost:3000/posts/' + activePost.id, {
            method: 'PATCH',
            body: JSON.stringify(activePost),
            headers: { 'Content-Type': 'application/json' },
        });
        window.location.replace(`main.html?id=${userSignedIn.id}`);
    }
};

likeBtn.addEventListener('click', () => {
    if (!likeBtn.classList.contains('active')) {
        likeBtn.classList.add('active');
    } else {
        likeBtn.classList.remove('active');
    }
});

// BOOKMARK FEATURE
const bookmarkedPostsArray = async () => {
    await renderIndividualPost();
    await loadUser();
    for (i = 0; i <= userSignedIn.bookmarkedPosts.length; i++) {
        if (userSignedIn.bookmarkedPosts[i] == activePost.title) {
            bookmarkBtn.classList.add('active');
        }
    }
};

const isBookmarked = async (e) => {
    const res = await renderIndividualPost();
    if (bookmarkBtn.classList.contains('active')) {
        userSignedIn.bookmarkedPosts.push(activePost.title);
        userSignedIn.bookmarkedPosts = [
            ...new Set(userSignedIn.bookmarkedPosts),
        ];
        await fetch('http://localhost:3000/users/' + userSignedIn.id, {
            method: 'PATCH',
            body: JSON.stringify(userSignedIn),
            headers: { 'Content-Type': 'application/json' },
        });
        window.location.replace(
            `main.html?id=${localStorage.getItem('userID')}`
        );
    }

    if (!bookmarkBtn.classList.contains('active')) {
        removeFromAnAray(userSignedIn.bookmarkedPosts, activePost.title);
        await fetch('http://localhost:3000/users/' + userSignedIn.id, {
            method: 'PATCH',
            body: JSON.stringify(userSignedIn),
            headers: { 'Content-Type': 'application/json' },
        });
        window.location.replace(
            `main.html?id=${localStorage.getItem('userID')}`
        );
    }
};

bookmarkBtn.addEventListener('click', () => {
    if (!bookmarkBtn.classList.contains('active')) {
        bookmarkBtn.classList.add('active');
    } else {
        bookmarkBtn.classList.remove('active');
    }
});

logo.addEventListener('click', () => {
    localStorage.removeItem('post');
    if (!userSignedIn) {
        window.location.replace(`main.html`);
    }
    isBookmarked();
    isThePostLiked();
});
const toProfilePage = () => {
    window.location.replace(`profile.html?id=${userSignedIn.id}`);
};
userBtn.addEventListener('click', () => {
    toProfilePage();
});
avatar.addEventListener('click', () => {
    toProfilePage();
});

const showEditAndDeleteButtons = async () => {
    await renderIndividualPost();
    await loadUser();
    if (userSignedIn.id == activePost.userId) {
        console.log('show me dem buttons!');
        editBtn.classList.add('active');
        deleteBtn.classList.add('active');
    }
};

window.addEventListener('DOMContentLoaded', () => {
    renderIndividualPost();
    renderComments();
    usersWhoLikedArray();
    bookmarkedPostsArray();
    loadUser();
    showEditAndDeleteButtons();
    updateLanguage();
});
