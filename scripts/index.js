const formPanels = document.querySelectorAll('.formPanel');
const darkBackgrounds = document.querySelectorAll('.darkBackground');

const signUpForm = document.querySelector('.signUpForm');
// const signInForm = document.querySelector('.signInForm');


const signUpBtn = document.querySelector('.signUpBtn');
const signUpPanel = document.querySelector('.signUpPanel');

const signInPanel = document.querySelector('.signInPanel');
const signInBtn = document.querySelector('.signInBtn');

const closeBtns = document.querySelectorAll('.closeBtn');

window.addEventListener('DOMContentLoaded', () => loadUsers());

const loadUsers = async () => {
    let uri = `http://localhost:3000/users`;
    const res = await fetch(uri);
    const users = await res.json();
    
    console.log(users);

    users.forEach(user => {
            console.log(user);
    });
}

const createUser = async (e) =>{
    e.preventDefault();
    const doc = {
        firstName: signUpForm.firstname.value,
        lastName: signUpForm.lastname.value,
        email: signUpForm.email.value,
        password: signUpForm.password.value,
    }
    await fetch('http://localhost:3000/users/', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' }
    });
    window.location.location(`/main.html?id=${doc.id}`);
}

signUpBtn.addEventListener('click', ()=>{
    signUpPanel.classList.add('active');
});

signInBtn.addEventListener('click', ()=>{
    signInPanel.classList.add('active');
});

for(let clsBtn of closeBtns){
    clsBtn.addEventListener('click', ()=>{
        for(let formPanel of formPanels)
            formPanel.classList.remove('active');
        });
    }

for(let darkBackground of darkBackgrounds){
    darkBackground.addEventListener('click', ()=>{
        for(let formPanel of formPanels){
            formPanel.classList.remove('active');
        }
    });
}    

// for(let i = 0; i <= closeBtn.length; i++){

// closeBtn[i].addEventListener('click', ()=>{
//     formPanel[i].classList.remove('active');
// });
// darkBackground[i].addEventListener('click', ()=>{
//     formPanel[i].classList.remove('active');
// });
// }
signUpForm.addEventListener('submit', createUser);