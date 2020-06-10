//function regListener() {
//    const users = JSON.parse(this.responseText);
//    console.log(users);
//}

//const xhr = new XMLHttpRequest();
//xhr.addEventListener('load', regListener);
//xhr.open('GET', '/Data/GetSchedules');
//xhr.send();

let currentUser;

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
	$.post("/Account/Register", { 'regdata': [$('#username').val(), $('#email').val(), $('#password').val(), $('#confirm-password').val()] }, function (data) {

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
	signOut();
	$.get("/Account/Logout", function (data) {
		$('#logged-user').html('');
	});
	setTimeout(
		function () {
			status(null);

		}, 500);
	$('.mask').html('');

}
//Google Functions to Log in and out
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}

function onSignIn(googleUser) {
	var id_token = googleUser.getAuthResponse().id_token;

	$.get("https://oauth2.googleapis.com/tokeninfo?id_token=" + id_token, function (data) {
		$('#loginErrors').toggleClass('alert alert-success');
		$('#loginErrors').html('logged in!');
		$('#logged-user').html(data.name);
		setTimeout(
			function () {
				$('#loginErrors').toggleClass('alert alert-success');
				$('#loginErrors').html('');
				if(document.getElementById("loginModal").style.display === "block"){
					$('#loginModal').modal('toggle');
					
				}
				$('div#masked').removeAttr('id');
			}, 800);
		
		status(data);
	});
}
//Google end
function status(item) {

	if (item != null) {
		$('div#masked').removeAttr('id');
		$('#user-Status').html('<i class="fas fa-user fa-2x mt-3 mb-3"></i>' +
			'<p> Welcome, <strong id="logged-user">' + item.name + '</strong></p>' +
			'<p>' + item.email + '</p>' +
			'<p> Your role: ' + item.role + '</p>' +
			'<button onclick="logout();" class="sm-btn">Logout</button>');
		if (item.role === "admin") {
			$('#fuggolegesmenu').html('<button data-toggle="modal" data-target="#scheduleModal" class="sm-btn-nav">' +
				'<i class="fas fa-plus-circle ml-3 mr-3"></i>New schedule' +
				'</button>' +
				'<button id="mySchedulesButton" class="sm-btn-nav">' +
				'<i class="fas fa-tasks ml-3 mr-3 animate"></i>My Schedules' +
				'</button>' +
				'<div id="accordionMySchedules" class="sm-accordion"></div>' +
				'<button class="sm-btn-nav" data-toggle="modal" data-target=".bd-example-modal-lg">' +
				'<i class="fas ml-3 mr-3 fa-clipboard-list"></i>View Logs' +
				'</button>');
		}
		else if(item.iss === "accounts.google.com"){
			$('#user-Status').html('<img src="' + item.picture + '" </img>' +
			'<p> Welcome, <strong id="logged-user">' + item.name + '</strong></p>' +
			'<p>' + item.email + '</p>' +
			'<p> Your role: ' + item.role + '</p>' +
			'<button onclick="logout();" class="sm-btn">Logout</button>');
			$('#fuggolegesmenu').html('<button data-toggle="modal" data-target="#scheduleModal" class="sm-btn-nav">' +
				'<i class="fas fa-plus-circle ml-3 mr-3"></i>New schedule' +
				'</button>' +
				'<button id="mySchedulesButton" class="sm-btn-nav">' +
				'<i class="fas fa-tasks ml-3 mr-3 animate"></i>My schedules' +
				'</button>' +
				'<div id="accordionMySchedules" class="sm-accordion"></div>')
		}
		else {
			$('#fuggolegesmenu').html('<button data-toggle="modal" data-target="#scheduleModal" class="sm-btn-nav">' +
				'<i class="fas fa-plus-circle ml-3 mr-3"></i>New schedule' +
				'</button>' +
				'<button id="mySchedulesButton" class="sm-btn-nav">' +
				'<i class="fas fa-tasks ml-3 mr-3 animate"></i>My schedules' +
				'</button>' +
				'<div id="accordionMySchedules" class="sm-accordion"></div>');
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
			url: "/Data/log",
			type: 'get',
			dataType: 'json',
			async: false,
			success: function (data) {
				log = data;
			}
		});

		if (log != undefined || null) {
			$.each(log, function (key, item) {
				$("#log-content").append('<p>' + item.date + item.message + '</p>');
			});
		}
		else { return null; }
	}
}

function getSchedule() {
	var user = getUser();
	var id = user.id;
	var date = new Date();


	var schedule = null;

	$.ajax({
		url: "/Data/schedule/" + id,
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


function getColumns(scheduleId) {
	var uri = "Data/GetColumns";
	var columns = [];
	$.getJSON(uri)
		.done(function (data) {
			$.each(data, function (key, item) {
				if (item.schedule_ID === scheduleId) {
					columns.push(item.id);
				}
				else {
					//console.log("nincs columnja");
				}
			});
		});
	return columns;
}

function getSlots(columnId) {
	var uri = "Data/GetSlots";
	var slots = [];
	$.getJSON(uri)
		.done(function (data) {
			$.each(columnId, function (sorsz, col_item) {
				$.each(data, function (key, item) {
					if (col_item === item.column_ID) {
						slots.push(item.id);
					}
					else {
						//console.log("nincs slotja");
					}
					
				});
			});
		});
	return slots;
}


function getTasks(slotId) {
	var uri = "Data/GetTasks";
	var tasks = [];
	$.getJSON(uri)
		.done(function (data) {
			$.each(data, function (key, item) {
				$.each(slotId, function (sorsz, slot_item) {
					if (slot_item === item.slot_ID) {
						tasks.push(item.id);
					}
					else {
						//console.log("nincs taskja");
					}
					
				});
			});
		});
	return tasks;
}

function getAllId() {
	var currUser = getUser();
	var userId = currUser.id;
	var currSchedule = getSchedule();
	var scheduleId = currSchedule[0].id;

	var columns = getColumns(scheduleId);
	var slots = getSlots(columns);
	var tasks = getTasks(slots);

	//var allId = { "UserId": userId }, { "ScheduleId": scheduleId }, { "ColumnsId": [columns] }, { "SlotsId": [slots] }, { "TasksId": [tasks] };
	var all = {
		"UserId": userId,
		"ScheduleId": scheduleId,
		"ColumnsId": columns,
		"SlotsId": slots,
		"TasksId": tasks
	}
	return all;
	
}

function convert(str) {
	var date = new Date(str),
		mnth = ("0" + (date.getMonth() + 1)).slice(-2),
		day = ("0" + date.getDate()).slice(-2);
	return [date.getFullYear(), mnth, day].join("-");
}


function newSchedule() {
	var user_id = getUser().id;
	$.post("/Data/Schedule", { 'table': [$('#schedule-name').val(), user_id] }, function (data) {
		console.log(data);
	});
}


$(document).ready(function () {
	//jQuery.ajaxSettings.traditional = true;
	$('#registerModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget)
		//var recipient = button.data('whatever')
		var modal = $(this)
		modal.find('.modal-title').text('Registration')
	});
	if (getUser()) { getLog(); }
	//getLog();
	status(getUser());
	currentUser = getUser();
	//cal();
	
});