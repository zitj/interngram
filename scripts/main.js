
const container = document.querySelector('.posts');
const userBtn = document.querySelector('.userBtn');

const id = new URLSearchParams(window.location.search).get('id');

const createNewPostBtn = document.querySelector('.createNewPostBtn');
const formPanel = document.querySelector('.formPanel');
const darkBackground = document.querySelector('.darkBackground');
const closeBtn = document.querySelector('.closeBtn');
const form = document.querySelector('form');

const loadingSpinner = document.querySelector('.loadingSpinner');
let counter = 4;

const renderUsers = async () => {
    let uri = `http://localhost:3000/users`;
    const res = await fetch(uri);
    const posts = await res.json();
    let template = '';

    posts.forEach(post => {
        if(post.id == id){
            template = post.firstName + ' ' + post.lastName;
        }
})
    userBtn.innerHTML = template;
}


const renderPosts = async () => {
    let uri = `http://localhost:3000/posts?_limit=${counter}`;

    const res = await fetch(uri);
    const posts = await res.json();

    let template = '';
    posts.forEach(post => {

        if(post.type === "IMAGE"){
            template += `
            <div class="post">
                <h2>${post.title}</h2>
                <img src="${post.meta.url}" alt="${post.meta.alt}">
                <a href="/post.html?id=${post.id}">details</a>
            </div>
        ` 
        }
        if(post.type === "VIDEO"){
            template += `
            <div class="post">
                <h2>${post.title}</h2>
                <iframe id="ytplayer" type="text/html" width="550" height="360"
                frameborder="0" src=${post.meta.url}></iframe>
                <a href="/post.html?id=${post.id}">details</a>
            </div>
        ` 
        }
        if(post.type === "LINK"){
        template += `
            <div class="post">
                <h2>${post.title}</h2>
                <a href="${post.meta.url}">${post.meta.url}</a>
                <a href="/post.html?id=${post.id}">details</a>
            </div>
        `
    }
    })

  container.innerHTML = template;

}

const createPost = async (e) =>{
    e.preventDefault();
    const doc = {
        title: form.title.value,
        type: form.type.value,
        meta:{
            url: form.content.value
        }
    }
    await fetch('http://localhost:3000/posts/', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.reload('/main.html');
}

const loading = () =>{
    counter += 4;
    loadingSpinner.classList.add('active');
    loadingSpinner.addEventListener('animationend', ()=>{
        loadingSpinner.classList.remove('active');        
        renderPosts();
    })
}


window.addEventListener('scroll', ()=>{
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    console.log({scrollTop, scrollHeight, clientHeight});

    if(clientHeight + scrollTop == scrollHeight){
        loading();
    }
});

const panelRemover = () => {
    darkBackground.classList.remove('active');
    formPanel.classList.remove('active');
}

createNewPostBtn.addEventListener('click', ()=>{
    formPanel.classList.add('active');
    darkBackground.classList.add('active');
});
darkBackground.addEventListener('click', ()=>{
    panelRemover();
});
closeBtn.addEventListener('click', ()=>{
    panelRemover();
});

form.addEventListener('submit', createPost);

window.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    renderUsers();
});