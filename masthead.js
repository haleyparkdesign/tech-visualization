d3.select('.masthead').style("height", window.innerWidth / 1440 * 627 + "px");
console.log(window.innerWidth);

window.addEventListener("resize", function () {
    console.log(window.innerWidth);
    if (window.innerWidth > 1440) {
        d3.select('.masthead').style("height", window.innerWidth / 1440 * 627 + "px");
    }
});
