
const container = document.querySelector('.posts');
const createBtn = document.querySelector('.createBtn');
const formPanel = document.querySelector('.formPanel');
const darkBackground = document.querySelector('.darkBackground');

const renderPosts = async () => {
    let uri = 'http://localhost:3000/posts';

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

createBtn.addEventListener('click', ()=>{
    formPanel.classList.add('active');
})
darkBackground.addEventListener('click', ()=>{
    formPanel.classList.remove('active');
})

window.addEventListener('DOMContentLoaded', () => renderPosts());