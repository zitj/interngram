const id = new URLSearchParams(window.location.search).get('id');
const body = document.querySelector('body');

const container = document.querySelector('.profileWrap');
const heading = container.querySelector('h2');
const paragraph = container.querySelector('p');
const containerImg = document.querySelector('.profilePicture');

const darkBackground = document.querySelector('.darkBackground');
const formPanel = document.querySelector('.formPanel');
const formHeading = formPanel.querySelector('h1');
const closeBtn = document.querySelector('.closeBtn');
const form = document.querySelector('form');
const saveChangesBtn = form.querySelector('button');

const avatarLabel = document.getElementById('avatarLabel');
const themeLabel = document.getElementById('themeLabel');
const languageLabel = document.getElementById('languageLabel');

const blueLabel = document.getElementById('blueLabel');
const pinkLabel = document.getElementById('pinkLabel');
const greenLabel = document.getElementById('greenLabel');
const darkGreyLabel = document.getElementById('darkGreyLabel');

const bulgarianLabel = document.getElementById('bulgarianLabel');
const englishLabel = document.getElementById('englishLabel');
const serbianLabel = document.getElementById('serbianLabel');

const logo = document.querySelector('.logo');
const signOutBtn = document.querySelector('.signOut');
const settingsBtn = document.querySelector('.settingsBtn');

let userSignedIn = {};

const loadUser = async () => {
    const res = await fetch(`http://localhost:3000/users/` + id);
    const user = await res.json();
    let profilePic = `<img id="profPic" src="${user.avatar}" alt="avatar">`;
    let userName = user.firstName + ' ' + user.lastName;
    let userEmail = user.email;

    body.classList.add(`${user.themeColor}`);

    containerImg.innerHTML = profilePic;
    heading.innerHTML = userName;
    paragraph.innerHTML = userEmail;

    userSignedIn = user;
};

const updateLanguage = async () => {
    await loadUser();
    let uri = `http://localhost:3000/languages`;
    const res = await fetch(uri);
    const languages = await res.json();
    languages.forEach((language) => {
        if (language.language == userSignedIn.language) {
            userLanguage = language;
        }
    });
    formHeading.innerHTML = `${userLanguage.settings}`;
    settingsBtn.innerHTML = `${userLanguage.settings}`;
    signOutBtn.innerHTML = `${userLanguage.signOut}`;
    saveChangesBtn.innerHTML = `${userLanguage.saveChanges}`;
    avatarLabel.innerHTML = `${userLanguage.uploadProfilePic}`;
    themeLabel.innerHTML = `${userLanguage.changeThemeColor}`;
    languageLabel.innerHTML = `${userLanguage.chooseLanguage}`;

    blueLabel.innerHTML = `${userLanguage.blue}`;
    pinkLabel.innerHTML = `${userLanguage.pink}`;
    greenLabel.innerHTML = `${userLanguage.green}`;
    darkGreyLabel.innerHTML = `${userLanguage.darkGrey}`;

    bulgarianLabel.innerHTML = `${userLanguage.bulgarian}`;
    englishLabel.innerHTML = `${userLanguage.english}`;
    serbianLabel.innerHTML = `${userLanguage.serbian}`;
};

const updateUser = async (e) => {
    e.preventDefault();
    const doc = {
        avatar: form.avatar.value,
        themeColor: form.theme.value,
        language: form.language.value,
    };
    await fetch('http://localhost:3000/users/' + id, {
        method: 'PATCH',
        body: JSON.stringify(doc),
        headers: { 'Content-Type': 'application/json' },
    });
    window.location.replace(`main.html?id=${id}`);
};

const panelRemover = () => {
    formPanel.classList.remove('active');
    darkBackground.classList.remove('active');
};

logo.addEventListener('click', () => {
    window.location.replace(`main.html?id=${id}`);
});

signOutBtn.addEventListener('click', () => {
    localStorage.removeItem('userID');
    localStorage.removeItem('postID');
    window.location.replace('../index.html');
});

settingsBtn.addEventListener('click', () => {
    formPanel.classList.add('active');
    darkBackground.classList.add('active');
    form.avatar.value = userSignedIn.avatar;
});

closeBtn.addEventListener('click', panelRemover);
darkBackground.addEventListener('click', panelRemover);

form.addEventListener('submit', updateUser);

window.addEventListener('DOMContentLoaded', () => {
    updateUser();
    updateLanguage();
});
