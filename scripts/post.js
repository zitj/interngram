const id = new URLSearchParams(window.location.search).get('id');
const body = document.querySelector('body');

const container = document.querySelector('.container');
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


const likeAndBookmarkContainer = document.querySelector('.likeAndBookmark');
const likeBtn = document.querySelector('.like');
const bookmarkBtn = document.querySelector('.bookmark');



let userSignedIn = {};
let activePost = {};


const loadUser = async () =>{
  const res = await fetch(`http://localhost:3000/users/` + localStorage.getItem('userID'));
  const user = await res.json();


  body.classList.add(`${user.themeColor}`);

  userSignedIn = user;
  console.log(userSignedIn);
}

const renderIndividualPost = async () => {
    const res = await fetch('http://localhost:3000/posts/' + id);
    const post = await res.json();   
    let template = '';
    activePost = post;
    if(post.type === 'IMAGE'){
         template = `
        <h1>${post.title}</h1>
        <img src="${post.meta.url}" alt="">
      `;
      likeAndBookmarkContainer.children[1].innerHTML = `Created by: ${post.userName}`;

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
    
      `;
      likeAndBookmarkContainer.children[1].innerHTML = `Created by: ${post.userName}`;

    }}
    if(post.type === 'LINK'){
        template = `
        <h1>${post.title}</h1>
        <a class='postLink' href="${post.meta.url}">${post.meta.url}</a>
 
      `;
      likeAndBookmarkContainer.children[1].innerHTML = `Created by: ${post.userName}`;

    }
    container.innerHTML = template;
    console.log(activePost);

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

//Submit comment

const submitComment = async (e) =>{
  e.preventDefault();
  const doc = {
    userId: userSignedIn.id,
    userName: userSignedIn.firstName + ' ' + userSignedIn.lastName,
    userAvatar: userSignedIn.avatar,
    postId: activePost.id,
    content: commentContent.value 

  }
  await fetch('http://localhost:3000/comments/', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
  window.location.reload(`/post.html?=${id}`);
}

//Edit post & Delete post

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

if(!userSignedIn){
  deleteBtn.addEventListener('click', async (e) => {
    const res = await fetch('http://localhost:3000/posts/' + id, {
      method: 'DELETE'
  })
    window.location.replace(`/main.html`);
  });  
}

deleteBtn.addEventListener('click', async (e) => {  
if(activePost.userId == userSignedIn.id){
    const res = await fetch('http://localhost:3000/posts/' + id, {
        method: 'DELETE'
    })
    window.location.replace(`/main.html?id=${userSignedIn.id}`);
  }else{
  alert('Sorry, you can not delete the post that is created by someone else.');
  };
});

const uploadInputs =  () =>{
title.value = activePost.title;
type.value = activePost.type;
content.value = activePost.meta.url;
}

  editBtn.addEventListener('click', ()=>{
    if(!userSignedIn || activePost.userId == userSignedIn.id){
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
    if(!userSignedIn){
      window.location.replace(`/main.html`);
    }
    isThePostLiked();
  });
  
// LIKE POST FEATURE

const waitForAnArray = async () => {
  const res = await loadUser();
  for(i = 0; i <= activePost.usersWhoLiked.length; i++){
    if(activePost.usersWhoLiked[i] == userSignedIn.id){
      likeBtn.classList.add('active');
    }
  }
}  

const removeFromAnAray = (arr, item) =>{
 for (var i = arr.length; i--;){
  if (arr[i] === item) {arr.splice(i, 1);}
 }
}

 const isThePostLiked = async (e) =>{
   const res = await renderIndividualPost();
   if(likeBtn.classList.contains('active')){
    
    activePost.usersWhoLiked.push(userSignedIn.id);
    activePost.usersWhoLiked = [...new Set(activePost.usersWhoLiked)];
    await fetch('http://localhost:3000/posts/' + activePost.id, {
       method: 'PATCH',
       body: JSON.stringify(activePost),
       headers: { 'Content-Type': 'application/json' }
      });
    window.location.replace(`/main.html?id=${userSignedIn.id}`);

   }

   if(!likeBtn.classList.contains('active')){
    
    removeFromAnAray(activePost.usersWhoLiked, userSignedIn.id);
    await fetch('http://localhost:3000/posts/' + activePost.id, {
      method: 'PATCH',
      body: JSON.stringify(activePost),
      headers: { 'Content-Type': 'application/json' }
        });
    window.location.replace(`/main.html?id=${userSignedIn.id}`);

   }
 }

 const returnUserWithNewArray = async (e) =>{
   const res = await isThePostLiked();
 }  

 likeBtn.addEventListener('click',() =>{
   if(!likeBtn.classList.contains('active')){
     likeBtn.classList.add('active');
    }else{
      likeBtn.classList.remove('active');
   }
 });


  window.addEventListener('DOMContentLoaded', () => {
    renderIndividualPost();
    renderComments();
    waitForAnArray();
    loadUser();
  });
