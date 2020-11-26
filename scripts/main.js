const body = document.querySelector('body');

const container = document.querySelector('.posts');
const userBtn = document.querySelector('.userBtn');
const nav = document.querySelector('nav');
const buttons = nav.querySelector('.buttons');
const logo = document.querySelector('.logo');
const id = new URLSearchParams(window.location.search).get('id');
let avatar = document.querySelector('.avatar');

const createNewPostBtn = document.querySelector('.createNewPostBtn');
const formPanel = document.querySelector('.formPanel');
const darkBackground = document.querySelector('.darkBackground');
const closeBtn = document.querySelector('.closeBtn');
const form = document.querySelector('form');

const loadingSpinner = document.querySelector('.loadingSpinner');

let userParsed = JSON.parse(localStorage.getItem("user"));
userBtn.innerHTML = userParsed.firstName + ' ' + userParsed.lastName;
avatar.src = userParsed.avatar;
body.classList.add(`${userParsed.themeColor}`);

let counter = 4;
let numberOfPosts = 0;

// const renderUser = async () => {
//     let uri = `http://localhost:3000/users?id=${id}`;
//     const res = await fetch(uri);
//     const user = await res.json();
//     let template = '';
    
//         if(user.id == id){
//             template = user.firstName + ' ' + user.lastName;
//             let userStringified = JSON.stringify(user);
//             localStorage.setItem("user",  userStringified);
//             avatar.src = user.avatar
//         }

//     userBtn.innerHTML = template;
// }

// const parseUser = async () => {
//     const res = await renderUsers();
//     userParsed = JSON.parse(localStorage.getItem("user"));
//     body.classList.add(`${userParsed.themeColor}`);
//     console.log(userParsed);
// }

const renderPosts = async () => {
    let uri = `http://localhost:3000/posts?_limit=${counter}`;

    const res = await fetch(uri);
    const posts = await res.json();
    numberOfPosts = posts.length;
    let template = '';
    posts.forEach(post => {
        
        if(post.type === "IMAGE"){
            template += `
            <div class="post">
                <h2>${post.title}</h2>
                <img src="${post.meta.url}" alt="${post.meta.alt}">
                <a href="/post.html?id=${post.id}">details</a>
                <p>Created by: ${post.userName}</p>
            </div>
        ` 
        }
        if(post.type === "VIDEO"){

            if(post.meta.url.split('=') && post.meta.url.split('&')){
                let link = post.meta.url.split('=');
                let linkID = link[1].split('&');
                let linkIdEmbed = linkID[0];
            
            template += `
            <div class="post">
                <h2>${post.title}</h2>
                <iframe id="ytplayer" type="text/html"
                frameborder="0" src='https://www.youtube.com/embed/${linkIdEmbed}'></iframe>
                <a href="/post.html?id=${post.id}">details</a>
                <p>Created by: ${post.userName}</p>
            </div>
        ` 
        }}
        if(post.type === "LINK"){
        template += `
            <div class="post">
                <h2>${post.title}</h2>
                <a class="postLink" href="${post.meta.url}">${post.meta.url}</a>
                <a href="/post.html?id=${post.id}">details</a>
                <p>Created by: ${post.userName}</p>
            </div>
        `
    }
    })

  container.innerHTML = template;
  console.log(numberOfPosts);
  console.log(userParsed);
}

const createPost = async (e) =>{
    e.preventDefault();
    const doc = {
        title: form.title.value,
        type: form.type.value,
        meta:{
            url: form.content.value
        },
        userId: userParsed.id,
        userName: userParsed.firstName + ' ' + userParsed.lastName,
        usersWhoLiked: []
    }
    await fetch('http://localhost:3000/posts/', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.reload('/main.html');
}

const loading = () =>{
    if(counter <= numberOfPosts){
            counter += 4;
            loadingSpinner.classList.add('active');
            loadingSpinner.addEventListener('animationend', ()=>{
            loadingSpinner.classList.remove('active');        
            renderPosts();
        })
    }
}


window.addEventListener('scroll', ()=>{
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if(clientHeight + scrollTop == scrollHeight){
        loading();
    }
});

const panelRemover = () => {
    darkBackground.classList.remove('active');
    formPanel.classList.remove('active');
}

const toProfilePage = () =>{
        window.location.replace(`/profile.html?id=${id}`);
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

logo.addEventListener('click', ()=>{
    localStorage.removeItem("user");
    window.location.replace('/index.html');
});

userBtn.addEventListener('click', ()=>{
    if(!userParsed){
        return;
    }else{
        toProfilePage();        
    }
 });
avatar.addEventListener('click', ()=>{
    if(!userParsed){
        return;
    }else{
        toProfilePage();        
    }
 });

form.addEventListener('submit', createPost);

window.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem("post");
    renderPosts();
});


