//globals
let scheduleDiv;

function addDay() {
    const theadRow = scheduleDiv.querySelector("thead > tr");
    const tbody = scheduleDiv.querySelector("tbody");

    currColumns.forEach(column => {
        const th = document.createElement("th");
        let task = null;
        th.textContent = column.title;
        theadRow.appendChild(th);
        //
        let i = 0;
        getSlotsByColumnID(column.id).forEach(slot => {
            const tr = document.getElementById(i);
            const td = document.createElement("td");

            td.setAttribute('slotid', slot.id);

            currTasks.forEach(task => {
                if (task.slot_ID == slot.id) {
                    td.innerText = task.title;
                }

            });

            //currTasks.filter(task => task.slot_ID == slot.id);

            td.style.cursor = "pointer";

            td.addEventListener("click", function () {
                var newTask = prompt('Enter your new task name: ' + slot.id);
                document.querySelector(`[slotid="${slot.id}"]`).innerText = newTask;
                $.post("/Data/Task", { 'table': [newTask, slot.id] });
            });
            tr.appendChild(td);
            tbody.appendChild(tr);
            i++;
        });
    });

    /*
    const count = theadRow.childElementCount;
    console.log(count);

    if (count < 8) {
        //add day headers
        const th = document.createElement("th");
        th.textContent = days[count - 1];
        theadRow.appendChild(th);

        //add slots
        tbodyRows.forEach(tr => {
            //console.log(tr);

            const td = document.createElement("td");
            td.innerText = days[count - 1] + "'s slot";
            td.style.cursor = "pointer";

            const tdHour = tr.querySelector("[data-hour]");     //Get the current row hour datacell

            td.addEventListener("click", function () {
                //console.log("clicked " + days[count - 1] + " at " + tdHour.dataset.hour + ":00");
                var newTask = prompt('Enter your new task name:');
                $.post("/Data/Task", { 'table': [newTask, getSlotIDByDayHour(days[count - 1], tdHour.dataset.hour)] });
            });
            tr.appendChild(td);
        });
    }
    */
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

function getTaskBySlotID(slotid) {
    currTasks.forEach(task => {
        if (task.slot_ID == slotid) {
            console.log('talalt: ' + task.title);
            return task.title;
        }
    });
    console.log('fucked!');
}

function getSlotIDByDayHour(day, hour) {
    let slotid;
    currColumns.forEach((column) => {
        if (column.title == day) {
            currSlots.forEach((slot) => {
                if (slot.column_ID == column.id && slot.hourValue == hour) {
                    slotid = slot.id;
                }
            });
        }
    });
    return slotid;
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

/*
window.addEventListener("load", function () {
    scheduleDiv = document.querySelector(".sm-schedule");
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
});
*/

let userSchedule = null;
let currColumns = null;
let currSlots = null;
let currTasks = null;
getUserSchedule(getUser().id);

