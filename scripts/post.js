const id = new URLSearchParams(window.location.search).get('id');
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

let userParsed = JSON.parse(localStorage.getItem("user"));
let postParsed;

const renderIndividualPost = async () => {
    const res = await fetch('http://localhost:3000/posts/' + id);
    const post = await res.json();   
    let template = '';
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
  });
