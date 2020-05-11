function regListener() {
    console.log(this.responseText);
}

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', regListener);
xhr.open('GET', '/users');
xhr.send();