const id = new URLSearchParams(window.location.search).get('id');
const container = document.querySelector('.individualPost');
const formPanel = document.querySelector('.formPanel');
const darkBackground = document.querySelector('.darkBackground');
const form = document.querySelector('form');

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
      `;
    }
    if(post.type === 'VIDEO'){
        template = `
        <h1>${post.title}</h1>
        <iframe id="ytplayer" type="text/html" width="550" height="360"
        frameborder="0" src=${post.meta.url}></iframe>
      `;
    }
    if(post.type === 'LINK'){
        template = `
        <h1>${post.title}</h1>
        <a href="${post.meta.url}">${post.meta.url}</a>
      `;
    }
    container.innerHTML = template;
    let postStringified = JSON.stringify(post);
    localStorage.setItem("post",  postStringified);
  }

  const uploadInputs = async () =>{
    const res = await fetch('http://localhost:3000/posts/' + id);
    const post = await res.json(); 
    form.title.value = post.title;
    form.type.value = post.type;
    form.content.value = post.meta.url;
}

const changePost = async (e) =>{
  
    e.preventDefault();
    const doc = {
        title: form.title.value,
        type: form.type.value,
        meta:{
            url: form.content.value
        }
    }
    await fetch('http://localhost:3000/posts/' + id, {
        method: 'PATCH',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.reload(`/post.html?=${id}`);
}
deleteBtn.addEventListener('click', async (e) => {
  if(postParsed.userId == userParsed.id){
    const res = await fetch('http://localhost:3000/posts/' + id, {
        method: 'DELETE'
    })
    window.location.replace(`/main.html?id=${userParsed.id}`);
  }else{
    alert('Sorry, you can not delete the post that is created by someone else.');
  }

})

const parsePost = async () =>{
  const res = await renderIndividualPost();
  postParsed = JSON.parse(localStorage.getItem("post"));
  console.log(postParsed);
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

  form.addEventListener('submit', changePost);

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
