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
    body.classList.add(`${userParsed.themeColor}`);
    if(post.type === 'IMAGE'){
         template = `
        <h1>${post.title}</h1>
        <img src="${post.meta.url}" alt="">
        <p>Created by: ${post.userName}</p>
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
        <p>Created by: ${post.userName}</p>
      `;
    }}
    if(post.type === 'LINK'){
        template = `
        <h1>${post.title}</h1>
        <a class='postLink' href="${post.meta.url}">${post.meta.url}</a>
        <p>Created by: ${post.userName}</p>
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
