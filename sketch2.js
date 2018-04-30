//var valueLabelWidth = 80; // space reserved for value labels (right)
var barWidth = 30; // width of one bar
var SalaryLabelWidth = 45; // on left 
var SalaryLabelPadding = 15; // on left 
var RaceSexLabelWidth = 10; // top of bars 
var RaceSexLabelPadding = 15; // padding between bar and bar labels (bottom)
var maxBarHeight = 700; // height of the bar with the max value
var gridPaddingHorizontal = 60;
var numYDivs = 6;
var multiplier = 3;
var height = maxBarHeight  + SalaryLabelWidth + SalaryLabelPadding;


d3.csv("payGap_race_sex.csv", function (data) {
    data.forEach(function (d) {
        d.race = d.race;
        d.sex = d.sex;
        d.salary = +d.salary;
    });

    console.log(data);
    
    
    var width =   SalaryLabelPadding + data.length * barWidth * multiplier;
    
    // accessor functions
    var raceSexLabel = function (d) {
        console.log(d);
        var racesex = d['race'] + "\n" + d['sex'];
//        racesex = racesex.value/split(/\r\n|\r|\n/g);
        return racesex;
    };
    
     var raceLabel = function (d) {

        return d['race'];
    };
    
    
     var sexLabel = function (d) {
//        console.log(d); 
      
        return d['sex'];
    };
    
    var salaryValue = function (d) {
        return parseFloat(d['salary']);
    };


    // sorting
    var sortedData = data.sort(function (a, b) {
        return d3.descending(salaryValue(a), salaryValue(b));
    });
    
    //extents of salaries 
    var salaryRange = d3.extent(data, function(d){ return d.salary });
    console.log(salaryRange);
    
    // scales
    
    //use when going throu8gh data to get the height of the bar
    var yScaleSalary = d3.scaleLinear()
        .domain([salaryRange[0] - 15, salaryRange[1] + 20])
        .range([maxBarHeight, 0]);
    var saltoHeight = function (d,i) {
        return yScaleSalary(d.salary) - RaceSexLabelPadding;
    }
    
    var ySalaryInterval = d3.scaleLinear().domain([numYDivs, 0]).rangeRound([salaryRange[0] - 15, salaryRange[1] + 20]);
    
    var salInt = function (d,i) {
        return "$" + ySalaryInterval(i) + "K";
    }
    
    var yScaleHeight = d3.scaleLinear().domain([0,numYDivs]).range([gridPaddingHorizontal, maxBarHeight + RaceSexLabelWidth]);
    
    var y = function (d, i) {
//        console.log(yScaleSalary(i));
        return yScaleHeight(i);
    };
   
    var x = d3.scaleLinear().domain([0, data.length]).range([SalaryLabelWidth + gridPaddingHorizontal + SalaryLabelPadding, width]);
    
     var xTextR = function (d, i) {
//        console.log(i);
        var val = x(i) + barWidth/2 + d.race.length;
         if(d.race === 'Hispanic') {
             val += 10;
         }
         if(d.race === 'Native A.') {
             val += 13;
         }
         if(d.race === 'White') { 
            val += 2;
         }
        console.log(val);
        return val;
    };
    
    
    var xTextS = function (d, i) {
//        console.log(i);
        var val = x(i) + barWidth/2 + d.sex.length;
        if(d.sex === 'Male') {
             val -= 1;
         }
         if(d.sex === 'Female') {
             val += 8;
         }
        console.log(val);
        return val;
    };
    
     var yTextS = function (d, i) {
//        
        return saltoHeight(d,i) - RaceSexLabelWidth;
    };
    
     var yTextR = function (d, i) {
//        
        return saltoHeight(d,i) - RaceSexLabelWidth - 17;
    };
    
    var xBar = function(d, i) {
        return x(i) - barWidth/2;
    }
    
    var yBar = function(d,i) {
        return 710 - saltoHeight(d, i);
    }
    
    // svg container element
    var plot2 = d3.select('#plot2').append("svg")
        .attr('width',  width)
        .attr('height', height );

    // grid line labels
    var gridContainer = plot2.append('g')
        .attr('transform', 'translate(' + RaceSexLabelPadding + ',' + 0 + ')');

    gridContainer.selectAll("text").data(x.ticks(numYDivs)).enter().append("text")
        .attr("x", SalaryLabelPadding)
        .attr("y", y )
        .attr("text-anchor", "middle")
        .text(salInt);
//    
//    
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
        .attr("dy", ".35em") // vertical-align: middle
        .attr('text-anchor', 'end')
        .text(raceLabel);
    
    var labelsContainerSex = plot2.append('g')
    .attr('transform', 'translate(' + RaceSexLabelPadding + ',' + 0 + ')');
    
    labelsContainerSex.selectAll('text').data(sortedData).enter().append('text')
        .attr('x', xTextS)
        .attr('y', yTextS )
        .attr('stroke', 'none')
        .attr("dy", ".35em") // vertical-align: middle
        .attr('text-anchor', 'end')
        .text(sexLabel);
    
     // bars
    var barsContainer = plot2.append('g')
        .attr('transform', 'translate(' + RaceSexLabelPadding + ',' + 0 + ')');

    barsContainer.selectAll("rect").data(sortedData).enter().append("rect")
        .attr('x', xBar)
        .attr('y', saltoHeight)
        .attr('height', yBar)
        .attr('width', barWidth)
        .attr('stroke', 'white')
        .attr('fill', function(d) {
            if(d.sex === 'Female') {return '#007F75'}
            else return '#ffa279';
    });
    
});