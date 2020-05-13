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

            
            $.each(data, function (key, item) {
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



function register() {
    $.post("/Account/Register", { 'regdata' : [$('#username').val(),$('#email').val(),$('#password').val(),$('#confirm-password').val()] }, function (data) {
        
        $.each(data, function (key, item) {
            if (item.errors != null && item.errors.length > 0) {
                $.each(item.errors, function (index, value) {
                    $('#regErrors').toggleClass('alert alert-danger');
                    $('#regErrors').html(item.errors[index]);
                    setTimeout(
                        function () {
                            $('#regErrors').toggleClass('alert alert-danger');
                            $('#regErrors').html('');
                        }, 3000);
                });

            }
            else {
                $('#regErrors').toggleClass('alert alert-success');
                $('#regErrors').html('Registration successful!');
                setTimeout(
                    function () {
                        $('#regErrors').toggleClass('alert alert-success');
                        $('#regErrors').html('');
                        $('#registerModal').modal('toggle')
                    }, 2000);
            }
        });
    });

    
}

$(document).ready(function () {
    //jQuery.ajaxSettings.traditional = true;
    $('#registerModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        //var recipient = button.data('whatever')
        var modal = $(this)
        modal.find('.modal-title').text('Registration')

        
        
    })
});