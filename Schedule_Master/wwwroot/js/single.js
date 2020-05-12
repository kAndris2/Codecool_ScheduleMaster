//function regListener() {
//    const users = JSON.parse(this.responseText);
//    console.log(users);
//}

//const xhr = new XMLHttpRequest();
//xhr.addEventListener('load', regListener);
//xhr.open('GET', '/Data/GetSchedules');
//xhr.send();


$(document).ready(function () {
    

});

function getUsers() {
    var uri = 'Data/GetUsers';

    $.getJSON(uri)
        .done(function (data) {
            //$("#products").empty();
            // On success, 'data' contains a list of products.
            $.each(data, function (key, item) {
                // Add a list item for the product.
                $('<li>', { text: formatItem(item) }).appendTo($('#products'));
            });
        });
}

function formatItem(item) {
    return item.name + ' email ' + item.email;
}