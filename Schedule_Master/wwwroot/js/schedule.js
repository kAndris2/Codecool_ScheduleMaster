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
            console.log(tr);

            const td = document.createElement("td");
            td.innerText = days[count - 1] + "'s slot";
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

function fillHours(schedule) {
    for (let i = 0; i < 24; i++) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.classList.add("sm-bold");

        td.innerHTML = i + ":00";

        tr.append(td);

        schedule.querySelector("tbody").appendChild(tr);
    }

    addDay();
}

window.onload = function () {
    scheduleDiv = document.querySelector(".sm-schedule");
    scheduleDiv.innerHTML = "<table> \
                        <thead> \
                        <tr> \
                        <!--empty row--> \
                        <th>&nbsp;</th> \
                        </tr> \
                        </thead> \
                        <tbody> \
                        </tbody> \
                        </table>";
    fillHours(scheduleDiv);
}

