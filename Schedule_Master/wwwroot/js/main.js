let registerButton;
let editSchedulesButton;    //Edit schedules button
let accordionEditSchedules;     //Edit schedules div

window.onload = function () {
    console.log("working like a charm");
    registerButton = this.document.getElementById("registerButton");
    editSchedulesButton = this.document.getElementById("toggleEditSchedules");
    accordionEditSchedules = this.document.getElementById("accordionEditSchedules");

    registerButton.addEventListener("click", this.showRegisterForm);
    editSchedulesButton.addEventListener("click", this.toggleEditSchedules);

    loadSchedules();
};

function showRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    const notRegisteredContainer = document.getElementById("notRegisteredContainer");

    notRegisteredContainer.classList.toggle("fade-out");    //fancy animation
    notRegisteredContainer.getElementsByTagName("button")[0].disabled = true;

    setTimeout(() => {
        notRegisteredContainer.remove();    //remove the register button, text, and exclamation mark
        registerForm.style.display = "block";
        registerForm.classList.toggle("fade-in");
    }, 500);
}

function toggleEditSchedules() {
    const ele = editSchedulesButton.getElementsByTagName("i");
    ele[0].classList.toggle("spin");

    toggleAccordion(accordionEditSchedules);

    console.log("hell yeah!");
}

function toggleAccordion(HTMLElement) {
    if (HTMLElement.style.maxHeight) {
        HTMLElement.style.maxHeight = null;
        editSchedulesButton.blur();   //remove focus
    } else {
        HTMLElement.style.maxHeight = HTMLElement.scrollHeight + "px";
    }
}

function loadSchedules() {
    //add items from db
    for (let i = 0; i < 5; i++) {
        const ele = document.createElement("button");
        ele.innerHTML = "Item " + i;
        ele.classList.add("sm-btn-nav");
        accordionEditSchedules.appendChild(ele);
    }
}