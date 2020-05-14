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

function login() {
    $.post("/Account/Login", { 'logindata': [$('#login-email').val(), $('#login-password').val()] }, function (data) {

        $.each(data, function (key, item) {
            if (item.errors != null && item.errors.length > 0) {
                $.each(item.errors, function (index, value) {
                    $('#loginErrors').toggleClass('alert alert-danger');
                    $('#loginErrors').html(item.errors[index]);
                    setTimeout(
                        function () {
                            $('#loginErrors').toggleClass('alert alert-danger');
                            $('#loginErrors').html('');
                        }, 3000);
                });

            }
            else {
                
                $('#loginErrors').toggleClass('alert alert-success');
                $('#loginErrors').html('Logged In!');
                $('#logged-user').html(item.name);
                setTimeout(
                    function () {
                        $('#loginErrors').toggleClass('alert alert-success');
                        $('#loginErrors').html('');
                        $('#loginModal').modal('toggle')
                        $('div#masked').removeAttr('id');
                    }, 800);
                status(item);
            }
        });
        
    });
}


function logout() {
    $.get("/Account/Logout", function (data) {
        $('#logged-user').html('');
    });
    setTimeout(
        function () {
            status(null);
            
        }, 500);
    
}

function status(item) {

    if (item != null) {
        $('div#masked').removeAttr('id');
        $('#user-Status').html('<i class="fas fa-user fa-2x mt-3 mb-3"></i>' +
            '<p> Welcome, <strong id="logged-user">' + item.name + '</strong></p>' +
            '<p>' + item.email + '</p>'+
            '<button onclick="logout();" class="sm-btn">Logout</button>');

        $('#fuggolegesmenu').html('<button class="sm-btn-nav">' +
            '<i class="fas fa-tasks ml-3 mr-3"></i>New schedule' +
            '</button>' +
            '<button class="sm-btn-nav" onclick="toggleDropDown();">' +
            '<i class="fas fa-cog ml-3 mr-3 animate-icon"></i>Edit schedules' +
            '</button>');
    }
    else {
        $('.mask').attr('id', 'masked');
        $('#user-Status').html('<i class="fas fa-exclamation fa-3x"></i>' +
                        '<p>You are not logged in! Log in, or register.</p>' +
                                    '<button data-toggle="modal" data-target="#loginModal" class="sm-btn pull-left" > Log In </button> ' +
                        '<button data-toggle="modal" data-target="#registerModal" class="sm-btn pull-left"> Register </button>');
                    $('#fuggolegesmenu').html('');
    }
}

function getUser() {
    var result = null;
    $.ajax({
        url: "/Account/Account",
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (data) {
            result = data;
        }
    });
    return result;
}

$(document).ready(function () {
    //jQuery.ajaxSettings.traditional = true;
    $('#registerModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        //var recipient = button.data('whatever')
        var modal = $(this)
        modal.find('.modal-title').text('Registration')
    });
    status(getUser());
});