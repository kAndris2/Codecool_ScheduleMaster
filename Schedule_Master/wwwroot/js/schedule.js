//globals
let scheduleDiv;
const minTaskChar = 3;
let showMinChar = `(min ${minTaskChar} character!)`;
const emptyCell = "-";

function getTaskBySlotID(slotid) {
    let result = null;
    currTasks.forEach(task => {
        if (task.slot_ID == slotid) {
            result = task;
        }
    });
    return result;
}

function addDay() {
    const theadRow = scheduleDiv.querySelector("thead > tr");
    const tbody = scheduleDiv.querySelector("tbody");

    currColumns.forEach(column => {
        const th = document.createElement("th");
        th.textContent = column.title;
        theadRow.appendChild(th);
        //
        let i = 0;
        getSlotsByColumnID(column.id).forEach(slot => {
            const tr = document.getElementById(i);
            const td = document.createElement("td");

            td.setAttribute('slotid', slot.id);
            //Right click classes
            td.setAttribute('class', 'context-menu-one');

            let title = emptyCell;
            currTasks.forEach(task => {
                if (task.slot_ID == slot.id) {
                    title = task.title;
                }
            });
            td.innerText = title;

            td.style.cursor = "pointer";

            td.addEventListener("click", function () {
                clickedSlot = slot;

                if (!isSlotContainsTask(slot.id)) {
                    var newTask = prompt
                        (
                            '[CREATE]:\n' +
                            '- slotID: ' + slot.id +
                            '\n\nEnter your new task name: \n' +
                            showMinChar
                        );
                    if (newTask.length >= 3) {
                        document.querySelector(`[slotid="${slot.id}"]`).innerText = newTask;
                        $.post("/Data/Task", { 'table': [newTask, slot.id] });
                    }
                }
            });
            tr.appendChild(td);
            tbody.appendChild(tr);
            i++;
        });
    });
}

function removeDay() {
    const trow = scheduleDiv.querySelector("thead > tr");
    const tbodyRows = scheduleDiv.querySelectorAll("tbody > tr");   //get tbody's tr elements

    const count = trow.childElementCount;

    if (count > 2) {
        trow.removeChild(trow.lastChild);

        tbodyRows.forEach(tr => {
            tr.removeChild(tr.lastChild);
        });
    }
}

function createSlots() {

}

function loadTasks() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoadTasks);
    xhr.open("GET", "Data/GetUsers");
    xhr.send();
}

function onLoadTasks() {
    console.log(this.responseText);

}

function getColumnsOfSchedule(scheduleid) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoadScheduleColumns);
    xhr.open("POST", "Data/GetColumnsOfSchedule/" + scheduleid);
    xhr.send();
}

function onLoadScheduleColumns() {
    currColumns = JSON.parse(this.responseText);
    getSlotOfSchedule(currSchedule.id);
}

function getSlotOfSchedule(scheduleid) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoadScheduleSlots);
    xhr.open("POST", "Data/GetSlotOfSchedule/" + scheduleid);
    xhr.send();
}

function getTasksOfSchedule(scheduleid) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoadScheduleTasks);
    xhr.open("POST", "Data/GetTasksOfSchedule/" + scheduleid);
    xhr.send();
}

function onLoadScheduleTasks() {
    currTasks = JSON.parse(this.responseText);
    createSchedule();
}

function onLoadScheduleSlots() {
    currSlots = JSON.parse(this.responseText);
    getTasksOfSchedule(currSchedule.id);
}

function getUserSchedules(userid) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoadUserSchedules);
    xhr.open("POST", "Data/GetUserSchedules/" + userid);
    xhr.send();
}

function onLoadUserSchedules() {
    userSchedules = JSON.parse(this.responseText);
}

function fillHours(schedule) {
    for (let i = 0; i < 24; i++) {
        const tr = document.createElement("tr");
        tr.setAttribute("id", i);
        const td = document.createElement("td");

        const hourAttr = document.createAttribute("data-hour")
        hourAttr.value = i;
        td.setAttributeNode(hourAttr);

        td.classList.add("sm-bold");

        td.innerHTML = i + ":00";

        tr.append(td);

        schedule.querySelector("tbody").appendChild(tr);
    }

    addDay();
}

function createSchedule() {
    document.getElementById("sch-title").innerHTML = currSchedule.title;
    scheduleDiv = document.querySelector(".sm-schedule");
    scheduleDiv.childNodes[0].remove();
    scheduleDiv.innerHTML = "<table> \
                        <thead> \
                        <tr> \
                        <!--empty row--> \
                        <th>HOURS</th> \
                        </tr> \
                        </thead> \
                        <tbody> \
                        </tbody> \
                        </table>";
    fillHours(scheduleDiv);
}

function isSlotContainsTask(slotid) {
    let check = false;
    currTasks.forEach(task => {
        if (task.slot_ID == slotid) {
            check = true;
        }
    });
    return check;
}

function getSlotsByColumnID(columnid) {
    slots = new Array();
    currSlots.forEach(slot => {
        if (slot.column_ID == columnid) {
            slots.push(slot);
        }
    });
    return slots;
}

let userSchedules = null;
let currSchedule = null;
let currColumns = null;
let currSlots = null;
let currTasks = null;
let clickedSlot = null;
getUserSchedules(getUser().id);

$(function () {
    $.contextMenu({
        selector: '.context-menu-one',
        callback: function (key, options) {
            let task = getTaskBySlotID(clickedSlot.id);

            if (key == 'details') {
                alert
                    (
                        "[DETAILS]:\n\n" +
                        `Slot ID: ${clickedSlot.id}\n` +
                        `Hour: ${(clickedSlot.hourValue - 1)}\n\n` +
                        `Task ID: ${task.id}\n` +
                        `Title: ${task.title}`
                    );
            }
            else if (key == 'edit') {
                var updateTask = prompt
                    (
                        '[EDIT]:\n\n' +
                        `Enter a new title for your task: (${task.title})\n` +
                        showMinChar
                    );
                if (updateTask.length >= 3) {
                    document.querySelector(`[slotid="${clickedSlot.id}"]`).innerText = updateTask;
                    $.post("/Data/UpdateTask", { 'data': [updateTask, clickedSlot.id] });
                }
            }
            else if (key == 'delete') {
                if (confirm(`[DELETE]:\n\nAre you sure you want to delete this task?\n(${task.title})`)) {
                    document.querySelector(`[slotid="${clickedSlot.id}"]`).innerText = emptyCell;
                    $.post("/Data/DeleteTask", { 'data': [clickedSlot.id] });
                }
            }

            /*
			var m = "clicked: " + key;
			window.console && console.log(m) || alert(m);
            */
        },
        items: {
            "details": { name: "Details", icon: "fas fa-eye" },
            "edit": { name: "Edit", icon: "far fa-edit" },
            "delete": { name: "Delete", icon: "delete" }
        }
    });

	/*
	$('.context-menu-one').on('click', function (e) {
		console.log('clicked', this);
	})
	*/
});

