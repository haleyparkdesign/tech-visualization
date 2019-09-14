var barWidth = 22; // width of one bar
var SalaryLabelWidth = 45; // on left 
var SalaryLabelPadding = 15; // on left 
var RaceSexLabelWidth = 10; // top of bars 
var RaceSexLabelPadding = 15; // padding between bar and bar labels (bottom)
var maxBarHeight = 700; // height of the bar with the max value
var gridPaddingHorizontal = 60;
var numYDivs = 8;
var multiplier = 3;
var width = 900;
var height = maxBarHeight + SalaryLabelWidth - 10;

var selectedBarsToDisplayWomen = {
    race: "Average",
    sex: "Female"
};
var selectedBarToDisplayMale = {
    race: "Average",
    sex: "Male"
};
var globalData;

var tooltip2 = d3.select("#plot2").append("div")
    .attr("class", "toolTip2")
    .style("display", "none");


//activate drop down menus to hover 
//Initialize interactive header 
function initOptionHeader() {
    var activeDropdown = {};
    document.getElementById('women-category').addEventListener('click', showDropdown);
    document.getElementById('male-category').addEventListener('click', showDropdown);

    function showDropdown(event) {
        console.log(event);
        console.log(this);
        if (activeDropdown.id && activeDropdown.id !== event.target.id) {
            activeDropdown.element.classList.remove('active');
        }
        //checking if a list element was clicked, changing the inner button value
        if (event.target.tagName === 'LI') {
            activeDropdown.button.innerHTML = event.target.innerHTML;
            console.log(event);

            if (event.target.id === 'Female') {
                console.log("inside female adding");
                selectedBarsToDisplayWomen.race = event.target.type;
                //            selectedBarsToDisplayWomen.sex = event.target.id;

            }
            if (event.target.id === 'Male') {
                selectedBarToDisplayMale.race = event.target.type;
                //            selectedBarToDisplayMale.sex = event.target.id;

            }

            console.log(selectedBarsToDisplayWomen);
            console.log(selectedBarToDisplayMale);
            draw.drawGreyBars([selectedBarsToDisplayWomen, selectedBarToDisplayMale]);

            for (var i = 0; i < event.target.parentNode.children.length; i++) {
                if (event.target.parentNode.children[i].classList.contains('check')) {
                    event.target.parentNode.children[i].classList.remove('check');
                }
            }
            //timeout here so the check is only visible after opening the dropdown again
            window.setTimeout(function () {
                event.target.classList.add('check');
            }, 500)
        }

        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].classList.contains('dropdown-selection')) {
                //        console.log(this.children[i]);
                //        console.log(this.children[i].visibility);
                activeDropdown.id = this.id;
                activeDropdown.element = this.children[i];
                this.children[i].classList.add('active');
                //        console.log(this.children[i]);
                //        console.log(this.children[i].visibility);
            }
            //adding the dropdown-button to our object
            else if (this.children[i].classList.contains('dropdown-button')) {
                activeDropdown.button = this.children[i];
            }
        }
    }

    window.onclick = function (event) {
        if (!event.target.classList.contains('dropdown-button') && activeDropdown) {
            activeDropdown.element.classList.remove('active');
        }
    }
}

initOptionHeader();

//getting data
d3.csv("./data/payGap_race_sex3.csv", function (data) {
    data.forEach(function (d) {
        d.race = d.race;
        d.sex = d.sex;
        d.salary = +d.salary;
    });

    console.log(data);
    globalData = data;
    draw();
});

function draw() {
    // accessor functions
    var raceSexLabel = function (d) {
        var racesex = d['race'] + "\n" + d['sex'];
        return racesex;
    };

    var raceLabel = function (d) {
        return d['race'];
    };

    var sexLabel = function (d) {
        return d['sex'];
    };

    var salaryValue = function (d) {
        return parseFloat(d['salary']);
    };

    // sorting
    var sortedData = globalData.sort(function (a, b) {
        return d3.descending(salaryValue(a), salaryValue(b));
    });

    globalData = sortedData;

    //accessor getSalaryForSexRace 
    function getSalaryForSexRace(sex, race) {
        for (var i = 0; i < sortedData.length; i++) {
            if (sortedData[i].sex === sex && sortedData[i].race === race)
                return sortedData[i].salary;
        }
    }

    //extents of salaries 
    var salaryRange = d3.extent(globalData, function (d) {
        return d.salary
    });
    console.log(salaryRange);

    // scales
    var upperBoundBuffer = 216; // make it end at $2000
    var lowerBoundBuffer = 195; // make it start at $800

    //use when going through data to get the height of the bar
    var yScaleSalary = d3.scaleLinear()
        .domain([salaryRange[0] - lowerBoundBuffer, salaryRange[1] + upperBoundBuffer])
        .range([maxBarHeight, 0]);

    var saltoHeight = function (d, i) {
        return yScaleSalary(d.salary) - RaceSexLabelPadding;
    }

    var ySalaryInterval = d3.scaleLinear().domain([numYDivs, 0])
        .rangeRound([salaryRange[0] - lowerBoundBuffer, salaryRange[1] + upperBoundBuffer]);

    var salInt = function (d, i) {
        return ySalaryInterval(i);
    }

    var yScaleHeight = d3.scaleLinear().domain([0, numYDivs]).range([gridPaddingHorizontal, maxBarHeight + RaceSexLabelWidth]);

    var y = function (d, i) {
        //        console.log(yScaleSalary(i));
        return yScaleHeight(i);
    };

    var x = d3.scaleLinear().domain([0, globalData.length]).range([SalaryLabelWidth + gridPaddingHorizontal + SalaryLabelPadding, width]);

    var xTextR = function (d, i) {
        var val = x(i) + barWidth / 2 + d.race.length;
        if (d.race === 'Hispanic') {
            val += 10;
        }
        if (d.race === 'Average') {
            val += 7;
        }
        if (d.race === 'White') {
            val += 2;
        }
        return val;
    };


    var xTextS = function (d, i) {
        var val = x(i) + barWidth / 2 + d.sex.length;
        if (d.sex === 'Male') {
            val -= 1;
        }
        if (d.sex === 'Female') {
            val += 7;
        }
        return val;
    };

    var yTextS = function (d, i) {
        return saltoHeight(d, i) - RaceSexLabelWidth;
    };

    var yTextR = function (d, i) {
        return saltoHeight(d, i) - RaceSexLabelWidth - 17;
    };

    var xBar = function (d, i) {
        return x(i) - barWidth / 2;
    }

    var yBar = function (d, i) {
        return 710 - saltoHeight(d, i);
    }

    // svg container element
    var plot2 = d3.select('#plot2').append("svg")
        .attr('width', width)
        .attr('height', height);

    // grid line labels
    var gridContainer = plot2.append('g')
        .attr('transform', 'translate(' + RaceSexLabelPadding + ',' + 0 + ')');

    gridContainer.selectAll("text").data(x.ticks(numYDivs)).enter().append("text")
        .attr("x", SalaryLabelPadding)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .text(salInt);

    // horizontal grid lines
    gridContainer.selectAll("line").data(yScaleHeight.ticks(numYDivs)).enter().append("line")
        .attr("x1", SalaryLabelWidth)
        .attr("x2", width)
        .attr("y1", y)
        .attr("y2", y)
        .style("stroke", "#ccc");


    //  bar labels
    var labelsContainerRace = plot2.append('g')
        .attr('transform', 'translate(' + RaceSexLabelPadding + ',' + 0 + ')');

    labelsContainerRace.selectAll('text').data(sortedData).enter().append('text')
        .attr('x', xTextR)
        .attr('y', yTextR)
        .attr('stroke', 'none')
        .attr("dx", "2px") // adjust to align with the bar
        .attr('text-anchor', 'end')
        .text(raceLabel);

    var labelsContainerSex = plot2.append('g')
        .attr('transform', 'translate(' + RaceSexLabelPadding + ',' + 0 + ')');
    labelsContainerSex.selectAll('text').data(sortedData).enter().append('text')
        .attr('x', xTextS)
        .attr('y', yTextS)
        .attr('stroke', 'none')
        .attr("dx", "2px") // adjust to align with the bar
        .attr('text-anchor', 'end')
        .text(sexLabel);

    // bars
    var barsContainer = plot2.append('g')
        .attr('transform', 'translate(' + RaceSexLabelPadding + ',' + 0 + ')');

    var rects = barsContainer.selectAll("rect").data(sortedData).enter().append("rect")
        .attr('x', xBar)
        .attr('y', saltoHeight)
        .attr('height', yBar)
        .attr('width', barWidth)
        .attr('stroke', 'transparent')
        .attr('fill', function (d) {
            if (d.sex === 'Female') {
                return '#007F75'
            } else return '#FF7B5C';
        });

    //interactivity of tooltip
    rects.on("mousemove", function (d) {
            tooltip2
                .style("left", d3.event.pageX + 10 + "px")
                .style("top", d3.event.pageY - 60 + "px")
                .style("display", "inline-block");

            tooltip2.html("Salary:<br>" + "$" + d.salary);

        })
        .on("mouseout", function (d) {
            tooltip2.style("display", "none");
        });


    var greyBarContainer = plot2.append('g')
        .attr('transform', 'translate(' + RaceSexLabelPadding + ',' + 0 + ')');


    //draw greyed out bars dynamically
    function drawGreyedBars(_block) {
        var womenPick = _block[0];
        var malePick = _block[1];
        console.log(womenPick);
        console.log(malePick);

        //Percentage Label
        var wSal = getSalaryForSexRace(womenPick.sex, womenPick.race);
        var mSal = getSalaryForSexRace(malePick.sex, malePick.race);

        var percentageToDisplay = Math.round((wSal / mSal) * 100);

        document.getElementById("percentSalary").innerHTML = percentageToDisplay + "%";

        //Bars
        function greyOut(point) {
            var greyedOut = !(womenPick.sex == point.sex && womenPick.race == point.race) && !(malePick.sex == point.sex && malePick.race == point.race);
            return greyedOut;
        }

        //remove the ones no longer being used
        rects.exit()
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .remove();

        //update the bars
        rects
            .transition()
            .duration(1000)
            .attr('fill', function (d) {
                if (d.sex === 'Female') {
                    return '#007F75'
                } else return '#FF7B5C';
            })
            .attr('opacity', function (d) {
                if (greyOut(d)) {
                    return 0.4;
                } else {
                    return 1.0;
                }
            });

        labelsContainerSex.selectAll('text')
            .transition()
            .duration(1000)
            .attr('opacity', function (d) {
                if (greyOut(d)) {
                    return 0.4;
                } else {
                    return 1.0;
                }
            });

        labelsContainerRace.selectAll('text')
            .transition()
            .duration(1000)
            .attr('opacity', function (d) {
                if (greyOut(d)) {
                    return 0.4;
                } else {
                    return 1.0;
                }
            });

    }
    draw.drawGreyBars = drawGreyedBars;
    draw.drawGreyBars([selectedBarsToDisplayWomen, selectedBarToDisplayMale]);

    plot2.append("text")
        .attr("x", 6)
        .attr("y", 30)
        .text("Median Weekly Earning ($)")
        .style("font-size", "12px");
}
