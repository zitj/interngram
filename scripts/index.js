const formPanel = document.querySelectorAll('.formPanel');
const darkBackground = document.querySelectorAll('.darkBackground');


const signUpBtn = document.querySelector('.signUpBtn');
const signUpPanel = document.querySelector('.signUpPanel');

const signInPanel = document.querySelector('.signInPanel');
const signInBtn = document.querySelector('.signInBtn');

const closeBtn = document.querySelectorAll('.closeBtn');

signUpBtn.addEventListener('click', ()=>{
    console.log('Would you like to sign up?');
    signUpPanel.classList.add('active');
});

signInBtn.addEventListener('click', ()=>{
    console.log('Would you like to sign in?');
    signInPanel.classList.add('active');
});

for(let i = 0; i <= closeBtn.length; i++){

closeBtn[i].addEventListener('click', ()=>{
    formPanel[i].classList.remove('active');
});
darkBackground[i].addEventListener('click', ()=>{
    formPanel[i].classList.remove('active');
});
}