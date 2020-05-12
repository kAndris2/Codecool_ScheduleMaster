//function regListener() {
//    const users = JSON.parse(this.responseText);
//    console.log(users);
//}

//const xhr = new XMLHttpRequest();
//xhr.addEventListener('load', regListener);
//xhr.open('GET', '/Data/GetSchedules');
//xhr.send();

function getUsers() {
    var uri = 'Data/GetUsers';

    $.getJSON(uri)
        .done(function (data) {
            $("#users").empty();

            // On success, 'data' contains a list of products.
            $.each(data, function (key, item) {
                // Add a list item for the product.
                $('<li>', { text: formatItem(item) }).appendTo($('#users'));
            });
        });
}

function getSchedules() {
    var uri = 'Data/GetSchedules';
}

function formatItem(item) {
    return item.name + ' email ' + item.email;
}



function test() {
    $.post("/Account/Register", { 'regdata' : ['usher','mail@asd.com','pass','pass'] }, function (data) {
        alert(data);
    });

    
}

$(document).ready(function () {
    jQuery.ajaxSettings.traditional = true;
    $('#registerModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        //var recipient = button.data('whatever')
        var modal = $(this)
        modal.find('.modal-title').text('Registration')

        
        
    })
});