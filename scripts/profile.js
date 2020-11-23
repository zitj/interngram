const id = new URLSearchParams(window.location.search).get('id');

const container = document.querySelector('.profileWrap');
const heading = container.querySelector('h2');
const paragraph = container.querySelector('p');
const containerImg = document.querySelector('.profilePicture');

const darkBackground = document.querySelector('.darkBackground');
const formPanel = document.querySelector('.formPanel');
const closeBtn = document.querySelector('.closeBtn');

const logo = document.querySelector('.logo');
const signOutBtn = document.querySelector('.signOut');
const settingsBtn = document.querySelector('.settingsBtn');

const loadUser = async () =>{
    const res = await fetch(`http://localhost:3000/users/` + id);
    const user = await res.json();
    let profilePic = `<img src="${user.avatar}" alt="avatar">`;
    let userName = user.firstName + ' ' + user.lastName;
    let userEmail = user.email;

    containerImg.innerHTML = profilePic;
    heading.innerHTML = userName;
    paragraph.innerHTML = userEmail;
}


const panelRemover = () =>{
    formPanel.classList.remove('active');
    darkBackground.classList.remove('active');
}

logo.addEventListener('click', ()=>{
    window.location.replace(`/main.html?id=${id}`);
});

signOutBtn.addEventListener('click', ()=>{
    localStorage.removeItem("user");
    localStorage.removeItem("post");
    window.location.replace('/index.html');
});

settingsBtn.addEventListener('click', ()=>{
    formPanel.classList.add('active');
    darkBackground.classList.add('active');
});

closeBtn.addEventListener('click', panelRemover);
darkBackground.addEventListener('click', panelRemover);

window.addEventListener('DOMContentLoaded', loadUser);
