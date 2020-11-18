const id = new URLSearchParams(window.location.search).get('id');
const container = document.querySelector('.individualPost');
// const form = document.querySelector('form');

// const deleteBtn = document.querySelector('.delete');
// const editBtn = document.querySelector('.edit');

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
  
  }

  window.addEventListener('DOMContentLoaded', () => renderIndividualPost());