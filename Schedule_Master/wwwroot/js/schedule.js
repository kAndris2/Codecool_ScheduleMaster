//globals
let scheduleDiv;

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

            let title = '-';
            currTasks.forEach(task => {
                if (task.slot_ID == slot.id) {
                    title = task.title;
                }
            });
            td.innerText = title;

            td.style.cursor = "pointer";

            td.addEventListener("click", function () {
                let minC = '(min 3 character!)';
                if (!isSlotContainsTask(slot.id)) {
                    var newTask = prompt
                        (
                            '[CREATE]:\n' +
                            '- slotID: ' + slot.id +
                            '\n\nEnter your new task name: \n' +
                            minC
                        );
                    if (newTask.length >= 3) {
                        document.querySelector(`[slotid="${slot.id}"]`).innerText = newTask;
                        $.post("/Data/Task", { 'table': [newTask, slot.id] });
                    }
                } else {
                    let task = getTaskBySlotID(slot.id);
                    var updateTask = prompt
                        (
                            '[EDIT]:\n' +
                            '- slotID: ' + slot.id +
                            '\n- Hour: ' + (slot.hourValue - 1) +
                            '\n- taskID: ' + task.id +
                            '\n- Title: ' + task.title +
                            '\n\nEnter a new title for your task:\n' +
                            minC
                        );
                    if (updateTask.length >= 3) {
                        document.querySelector(`[slotid="${slot.id}"]`).innerText = updateTask;
                        $.post("/Data/UpdateTask", { 'data': [updateTask, slot.id] });
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
    getSlotOfSchedule(userSchedule.id);
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
    getTasksOfSchedule(userSchedule.id);
}

function getUserSchedule(userid) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoadUserSchedule);
    xhr.open("POST", "Data/GetUserSchedule/" + userid);
    xhr.send();
}

function onLoadUserSchedule() {
    userSchedule = JSON.parse(this.responseText);
    getColumnsOfSchedule(userSchedule.id);
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
    document.getElementById("sch-title").innerHTML = userSchedule.title;
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

let userSchedule = null;
let currColumns = null;
let currSlots = null;
let currTasks = null;
getUserSchedule(getUser().id);

