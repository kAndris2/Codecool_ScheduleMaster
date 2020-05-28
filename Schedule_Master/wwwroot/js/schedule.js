//globals
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let scheduleDiv;

function addDay() {
    const theadRow = scheduleDiv.querySelector("thead > tr");
    const tbodyRows = scheduleDiv.querySelectorAll("tbody > tr");   //get tbody's tr elements

    const count = theadRow.childElementCount;

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
                console.log("clicked " + days[count - 1] + " at " + tdHour.dataset.hour + ":00");
            });
            tr.appendChild(td);
        });
    }
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

function fillHours(schedule) {
    for (let i = 0; i < 24; i++) {
        const tr = document.createElement("tr");
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

