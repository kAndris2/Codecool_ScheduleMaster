function regListener() {
    const users = JSON.parse(this.responseText);
    console.log(users);
}

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', regListener);
xhr.open('GET', '/Data/GetSchedules');
xhr.send();