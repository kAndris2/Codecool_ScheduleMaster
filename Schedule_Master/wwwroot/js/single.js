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
               
                location.reload();
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
    $('.mask').html('');
    
}

function status(item) {

    if (item != null) {
        $('div#masked').removeAttr('id');
        $('#user-Status').html('<i class="fas fa-user fa-2x mt-3 mb-3"></i>' +
            '<p> Welcome, <strong id="logged-user">' + item.name + '</strong></p>' +
            '<p>' + item.email + '</p>' +
            '<p> Your role: ' + item.role + '</p>' +
            '<button onclick="logout();" class="sm-btn">Logout</button>');

        if (item.role === "admin") {
            $('#fuggolegesmenu').html('<button class="sm-btn-nav">' +
                '<i class="fas fa-tasks ml-3 mr-3"></i>New schedule' +
                '</button>' +
                '<button class="sm-btn-nav" onclick="toggleDropDown();">' +
                '<i class="fas fa-cog ml-3 mr-3 animate-icon"></i>Edit schedules' +
                '</button>' +
                '<button class="sm-btn-nav" data-toggle="modal" data-target=".bd-example-modal-lg" onclick="getLog();">' +
                '<i class="fas ml-3 mr-3 fa-clipboard-list"></i>View Logs' +
                '</button>');
        }
        else {
            $('#fuggolegesmenu').html('<button class="sm-btn-nav">' +
                '<i class="fas fa-tasks ml-3 mr-3"></i>New schedule' +
                '</button>' +
                '<button class="sm-btn-nav" onclick="toggleDropDown();">' +
                '<i class="fas fa-cog ml-3 mr-3 animate-icon"></i>Edit schedules' +
                '</button>');
        }
        
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

function getLog() {
    var user = getUser();
    var log = null;
    if (user.role != "admin") {
        return null;
    }
    else {
        $.ajax({
            url: "/Data/log/",
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                log = data;
            }
        });

        if (log != undefined || null) {
            $.each(log, function (key, item) {
                $("#log-content").append('<p>'+item.date+item.message+'</p>');
            });
        }
        else { return null;}
    }
}

function getSchedule() {
    var user = getUser();
    var id = user.id;
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var schedule = null;

    $.ajax({
        url: "/Data/schedule/"+id,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (data) {
            schedule = data;
        }
    });
    
    if (schedule != undefined || null) {
        var arr = [];
        $.each(schedule, function (key, item) {
            //console.log([item]);
            if (item.start === item.end) { item.allDay = false; }
            else { item.allDay = true; }
            item.start = new Date(item.start);
            item.end = new Date(item.end);
            arr.push(item);
        });
        
        return arr;
    }
    else { return [{}]; }
   
}

function convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
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
    cal();
});