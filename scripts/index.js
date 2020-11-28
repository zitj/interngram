const formPanels = document.querySelectorAll('.formPanel');
const darkBackground = document.querySelector('.darkBackground');

const signUpForm = document.querySelector('.signUpForm');
const signInForm = document.querySelector('.signInForm');

const signUpBtn = document.querySelector('.signUpBtn');
const signUpPanel = document.querySelector('.signUpPanel');
const signInPanelBtn = document.querySelector('.signInPanelBtn');

const signInPanel = document.querySelector('.signInPanel');
const signInBtn = document.querySelector('.signInBtn');

const closeBtns = document.querySelectorAll('.closeBtn');

window.addEventListener('DOMContentLoaded', () => loadUsers());

const loadUsers = async () => {
    let uri = `http://localhost:3000/users`;
    const res = await fetch(uri);
    const users = await res.json();
};

const signInUser = async () => {
    let uri = `http://localhost:3000/users`;
    const res = await fetch(uri);
    const users = await res.json();
    users.forEach((user) => {
        signInForm.email.value.toString();
        signInForm.password.value.toString();

        if (
            user.email == signInForm.email.value &&
            user.password == signInForm.password.value
        ) {
            window.location.replace(`html/main.html?id=${user.id}`);
        } else {
            return;
        }
    });
};

const createUser = async (e) => {
    e.preventDefault();
    const doc = {
        firstName: signUpForm.firstname.value,
        lastName: signUpForm.lastname.value,
        email: signUpForm.email.value,
        password: signUpForm.password.value,
        language: 'english',
        bookmarkedPosts: [],
    };
    await fetch('http://localhost:3000/users/', {
        method: 'POST',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' },
    });
    alert('You have successfully created an account!');
};

signUpBtn.addEventListener('click', () => {
    signUpPanel.classList.add('active');
    darkBackground.classList.add('active');
});

signInBtn.addEventListener('click', () => {
    darkBackground.classList.add('active');
    signInPanel.classList.add('active');
});

for (let clsBtn of closeBtns) {
    clsBtn.addEventListener('click', () => {
        for (let formPanel of formPanels) {
            formPanel.classList.remove('active');
        }
        darkBackground.classList.remove('active');
    });
}

darkBackground.addEventListener('click', () => {
    for (let formPanel of formPanels) {
        formPanel.classList.remove('active');
    }
    darkBackground.classList.remove('active');
});

signUpForm.addEventListener('submit', createUser);
signInPanelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signInUser();
});
