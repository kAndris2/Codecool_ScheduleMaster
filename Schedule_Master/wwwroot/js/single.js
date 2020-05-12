function onLoadUsers() {
    const users = JSON.parse(this.responseText);
    console.log(users);
}

function onLoad() {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', onLoadUsers);
    xhr.open('GET', '/Data/GetUsers');
    xhr.send();
    //
    xhr.addEventListener('load', onLoadSchedules);
    xhr.open('GET', '/Data/GetSchedules');
    xhr.send();
}

function User(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
}

const user;