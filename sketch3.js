var valueLabelWidth = 80; // space reserved for value labels (right)
var barHeight = 20; // height of one bar
var companyLabelWidth = 120; // space reserved for bar labels
var companyLabelPadding = 15; // padding between bar and bar labels (left)
var gridLabelHeight = 18; // space reserved for gridline labels
var gridChartOffset = 10; // space between start of grid and first bar
var maxBarWidth = 700; // width of the bar with the max value

d3.csv("diversity.csv", function (data) {
    data.forEach(function (d) {
        d.company = d.Company;
        d.female = +d.Female;
        d.male = +d.Male;
    });

    console.log(data);
    // accessor functions
    var companyLabel = function (d) {
        return d['Company'];
    };
    var femaleValue = function (d) {
        return parseFloat(d['Female']);
    };

    var maleValue = function (d) {
        return parseFloat(d['male']);
    };

    var total = function (d) {
        return 100;
    }

    // sorting
    var sortedData = data.sort(function (a, b) {
        return d3.descending(femaleValue(a), femaleValue(b));
    });

    // scales
    var yScale = d3.scaleBand().domain(d3.range(0, data.length)).rangeRound([0, data.length * barHeight * 2]);

    var y = function (d, i) {
        return yScale(i);
    };
    var yText = function (d, i) {
        return y(d, i) + yScale.bandwidth() / 2;
    };
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, total)])
        .range([0, maxBarWidth]);

    // svg container element
    var plot3 = d3.select('#plot3').append("svg")
        .attr('width', maxBarWidth + companyLabelWidth + valueLabelWidth)
        .attr('height', gridLabelHeight + gridChartOffset + data.length * barHeight * 2);

    // grid line labels
    var gridContainer = plot3.append('g')
        .attr('transform', 'translate(' + companyLabelWidth + ',' + gridLabelHeight + ')');

    gridContainer.selectAll("text").data(x.ticks(10)).enter().append("text")
        .attr("x", x)
        .attr("dy", -3)
        .attr("text-anchor", "middle")
        .text(String);
    // vertical grid lines
    gridContainer.selectAll("line").data(x.ticks(10)).enter().append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", data.length * barHeight * 2 + gridChartOffset)
        .style("stroke", "#ccc");

    // bar labels
    var labelsContainer = plot3.append('g')
        .attr('transform', 'translate(' + (companyLabelWidth - companyLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')');

    labelsContainer.selectAll('text').data(data).enter().append('text')
        .attr('y', yText)
        .attr('stroke', 'none')
        .attr("dy", ".35em") // vertical-align: middle
        .attr('text-anchor', 'end')
        .text(companyLabel);

    // bars
    var barsContainer = plot3.append('g')
        .attr('transform', 'translate(' + companyLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')');

    barsContainer.selectAll("rect").data(data).enter().append("rect")
        .attr('y', y)
        .attr('height', 28)
        .attr('width', function (d) {
            return x(femaleValue(d));
        })
        .attr('stroke', 'white')
        .attr('fill', '#007F75');

    //    barsContainer.selectAll("rect").data(data).enter().append("rect")
    //        .attr('y', y)
    //        .attr('height', yScale.rangeBand())
    //        .attr('width', function (d) {
    //            return x(maleValue(d));
    //        })
    //        .attr('stroke', 'white')
    //        .attr('fill', '#FF7B5C');

    // bar value labels
    barsContainer.selectAll("text").data(data).enter().append("text")
        .attr("x", function (d) {
            return x(femaleValue(d));
        })
        .attr("y", yText)
        .attr("dx", 3) // padding-left
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "start") // text-align: right
        .attr("fill", "black")
        .attr("stroke", "none")
        .text(function (d) {
            return Math.round(femaleValue(d), 2);
        });

    // start line
    barsContainer.append("line")
        .attr("y1", -gridChartOffset)
        .attr("y2", data.length * barHeight * 2 + gridChartOffset)
        .style("stroke", "#282828");
});
