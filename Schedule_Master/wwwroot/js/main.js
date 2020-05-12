window.onload = function () {
    console.log("working like a charm");
};

function toggleDropDown() {
    const ele = document.getElementsByClassName("fa-cog");
    ele[0].classList.toggle("spin");
    console.log("hell yeah!");
}