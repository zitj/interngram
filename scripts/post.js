const id = new URLSearchParams(window.location.search).get('id');
const body = document.querySelector('body');

const container = document.querySelector('.individualPost');
const formPanel = document.querySelector('.formPanel');
const darkBackground = document.querySelector('.darkBackground');
const form = document.querySelector('form');
const editForm = document.getElementById('editForm');
const title = document.getElementById('title');
const type = document.getElementById('type');
const content = document.getElementById('content');

const logo = document.querySelector('.logo');
const closeBtn = document.querySelector('.closeBtn');
const deleteBtn = document.querySelector('.delete');
const editBtn = document.querySelector('.edit');

const commentSection = document.querySelector('.commentSection');
const commentsContainer = document.querySelector('.comments');
const commentForm = document.querySelector('.commentForm');
const commentContent = document.getElementById('comment');

let userParsed = JSON.parse(localStorage.getItem("user"));
let postParsed;

const renderIndividualPost = async () => {
    const res = await fetch('http://localhost:3000/posts/' + id);
    const post = await res.json();   
    let template = '';
    if(userParsed){
      body.classList.add(`${userParsed.themeColor}`);
    }
    if(post.type === 'IMAGE'){
         template = `
        <h1>${post.title}</h1>
        <img src="${post.meta.url}" alt="">
        <div class="likeAndBookmark">
        <button class="like">like</button>
        <button class="bookmark">bookmark</button>
        <p>Created by: ${post.userName}</p>
        </div>
      `;
    }
    if(post.type === 'VIDEO'){
      if(post.meta.url.split('=') && post.meta.url.split('&')){
        let link = post.meta.url.split('=');
        let linkID = link[1].split('&');
        let linkIdEmbed = linkID[0];

        template = `
        <h1>${post.title}</h1>
        <iframe id="ytplayer" type="text/html"
        frameborder="0" src='https://www.youtube.com/embed/${linkIdEmbed}'></iframe>
        <div class="likeAndBookmark">
        <div class="buttons">
        <button class="like "><span><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="18" height="18"
        viewBox="0 0 172 172"
        style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#027cce"><path d="M79.12,10.32c-1.89469,0 -3.44,1.54531 -3.44,3.44v26.66l-13.76,35.26v72.24c1.42438,4.00438 5.83188,6.88 10.32,6.88h65.36c7.59219,0 13.76,-6.16781 13.76,-13.76c0,-2.83531 -0.90031,-5.44219 -2.365,-7.6325c5.36156,-1.88125 9.245,-7.01437 9.245,-13.0075c0,-3.37281 -1.20937,-6.42312 -3.225,-8.815c3.99094,-2.40531 6.665,-6.82625 6.665,-11.825c0,-3.37281 -1.20937,-6.42312 -3.225,-8.815c3.99094,-2.40531 6.665,-6.82625 6.665,-11.825c0,-7.59219 -6.16781,-13.76 -13.76,-13.76h-50.31c2.09625,-6.63812 5.59,-18.51687 5.59,-24.08c0,-12.95375 -9.48687,-30.96 -18.8125,-30.96zM10.32,65.36c-0.98094,0 -1.92156,0.44344 -2.58,1.1825c-0.65844,0.73906 -0.98094,1.70656 -0.86,2.6875l10.32,82.56c0.215,1.72 1.70656,3.01 3.44,3.01h30.96c1.89469,0 3.44,-1.53187 3.44,-3.44v-82.56c0,-1.89469 -1.54531,-3.44 -3.44,-3.44zM39.56,130.72c2.84875,0 5.16,2.31125 5.16,5.16c0,2.84875 -2.31125,5.16 -5.16,5.16c-2.84875,0 -5.16,-2.31125 -5.16,-5.16c0,-2.84875 2.31125,-5.16 5.16,-5.16z"></path></g></g></svg></span>Like<span>d</span></button>
        <button class="bookmark"><span><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="18" height="18"
        viewBox="0 0 172 172"
        style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#3498db"><path d="M86.03499,17.91667c-2.04938,-0.0128 -3.92773,1.14081 -4.8431,2.97445l-18.46257,36.92513l-43.83984,6.74674c-2.00099,0.3092 -3.6585,1.71652 -4.28813,3.64087c-0.62963,1.92435 -0.12455,4.03925 1.30668,5.47143l30.32536,30.32536l-6.75374,43.88883c-0.3081,2.00231 0.53568,4.00778 2.18261,5.18754c1.64692,1.17975 3.81724,1.3334 5.61394,0.39742l38.7238,-20.20524l38.7238,20.20524c1.7967,0.93597 3.96702,0.78233 5.61394,-0.39742c1.64692,-1.17975 2.49071,-3.18523 2.18261,-5.18754l-6.75374,-43.88883l30.32536,-30.32536c1.43123,-1.43218 1.93631,-3.54708 1.30668,-5.47143c-0.62963,-1.92435 -2.28714,-3.33168 -4.28813,-3.64087l-43.83984,-6.74674l-18.46257,-36.92513c-0.90411,-1.81108 -2.74895,-2.96073 -4.77311,-2.97445z"></path></g></g></svg></span>Bookmark<span>ed</span></button>
        </div>
        <p>Created by: ${post.userName}</p>
        </div>
      `;
    }}
    if(post.type === 'LINK'){
        template = `
        <h1>${post.title}</h1>
        <a class='postLink' href="${post.meta.url}">${post.meta.url}</a>
        <div class="likeAndBookmark">
        <button class="like">like</button>
        <button class="bookmark">bookmark</button>
        <p>Created by: ${post.userName}</p>
        </div>
      `;
    }
    container.innerHTML = template;
    let postStringified = JSON.stringify(post);
    localStorage.setItem("post",  postStringified);
  }

const renderComments = async () =>{
  const res = await fetch('http://localhost:3000/comments/');
  const comments = await res.json();
  let template = '';
  comments.forEach(comment => {
    if(comment.postId == id){
      template += `
      <div class="comment">
      <div class="user">
      <img src=${comment.userAvatar} alt=${comment.userName}>
      <p>${comment.userName}</p>
      </div>
      <p class="usersComment">${comment.content}</p>
      
      </div>
      `
      console.log(comment);
    }
    
  });
  commentsContainer.innerHTML = template;
}  


const submitComment = async (e) =>{
  e.preventDefault();
  const doc = {
    userId: userParsed.id,
    userName: userParsed.firstName + ' ' + userParsed.lastName,
    userAvatar: userParsed.avatar,
    postId: postParsed.id,
    content: commentContent.value 

  }
  await fetch('http://localhost:3000/comments/', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
  window.location.reload(`/post.html?=${id}`);
}

const changePost = async (e) =>{
  
    e.preventDefault();
    const doc = {
        title: title.value,
        type: type.value,
        meta:{
            url: content.value
        }
    }
    await fetch('http://localhost:3000/posts/' + id, {
        method: 'PATCH',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.reload(`/post.html?=${id}`);
}

if(!userParsed){
  deleteBtn.addEventListener('click', async (e) => {
    const res = await fetch('http://localhost:3000/posts/' + id, {
      method: 'DELETE'
  })
    window.location.replace(`/main.html`);
  });  
}

deleteBtn.addEventListener('click', async (e) => {  
if(postParsed.userId == userParsed.id){
    const res = await fetch('http://localhost:3000/posts/' + id, {
        method: 'DELETE'
    })
    window.location.replace(`/main.html?id=${userParsed.id}`);
  }else{
  alert('Sorry, you can not delete the post that is created by someone else.');
  };
});

const parsePost = async () =>{
  const res = await renderIndividualPost();
  postParsed = JSON.parse(localStorage.getItem("post"));
  console.log(postParsed);
}
const uploadInputs =  () =>{
title.value = postParsed.title;
type.value = postParsed.type;
content.value = postParsed.meta.url;
}

  editBtn.addEventListener('click', ()=>{
    if(!userParsed || postParsed.userId == userParsed.id){
      formPanel.classList.add('active');
      darkBackground.classList.add('active');
      uploadInputs();
    }else{
      alert('Sorry, you can not edit the post that is created by someone else.');
    }
  })

const panelRemover = () => {
    formPanel.classList.remove('active');
    darkBackground.classList.remove('active');
}  
  closeBtn.addEventListener('click', ()=>{
    panelRemover();
  })
  darkBackground.addEventListener('click', ()=>{
    panelRemover();
  })

  editForm.addEventListener('submit', changePost);
  commentForm.addEventListener('submit', submitComment);

  logo.addEventListener('click', () =>{
    localStorage.removeItem('post');
    if(!userParsed){
      window.location.replace(`/main.html`);
    }
      window.location.replace(`/main.html?id=${userParsed.id}`);
  });

  window.addEventListener('DOMContentLoaded', () => {
    renderIndividualPost();
    parsePost();
    renderComments();
  });
