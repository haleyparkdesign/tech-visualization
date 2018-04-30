var valueLabelWidth = 80; // space reserved for value labels (right)
var barHeight = 20; // height of one bar
var companyLabelWidth = 120; // space reserved for bar labels
var companyLabelPadding = 15; // padding between bar and bar labels (left)
var gridLabelHeight = 18; // space reserved for gridline labels
var gridChartOffset = 10; // space between start of grid and first bar
var maxBarWidth = 700; // width of the bar with the max value

var svg = d3.select("#plot3").append("svg")
    .attr("width", maxBarWidth + companyLabelWidth + valueLabelWidth)
    .attr("height", 800),
    margin = {
        top: 20,
        right: 60,
        bottom: 30,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear()
    .rangeRound([0, maxBarWidth]);

var y = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.3)
    .align(0.1);

var colors = d3.scaleOrdinal()
    .range(["#007F75", "#FF7B5C"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

d3.csv("diversity.csv", type, function (error, data) {
    if (error) throw error;

    data.sort(function (a, b) {
        return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total;
    });

    y.domain(data.map(function (d) {
        return d.Company;
    }));

    colors.domain(data.columns.slice(1));

    g.attr('transform', 'translate(' + companyLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')');


    var axisY = g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))

    axisY.selectAll("text")
        .style("fill", "#282828")
        .attr("font-size", "15px")
        .attr("font-family", "Work Sans");

    axisY.selectAll("line")
        .style("stroke", "transparent");

    var axisX = g.append("g")
        .attr("class", "axis axis--x")
        .call(d3.axisTop(x).ticks(10, "%"));

    axisX.selectAll("line")
        .attr("y1", function () {
            return 3
        })
        .attr("y2", function () {
            return 773
        })
        .style("stroke", "#ccc");

    axisX.selectAll("text")
        .style("fill", "#282828")
        .attr("font-size", "15px")
        .attr("font-family", "Work Sans");

    var serie = g.selectAll(".serie")
        .data(stack.keys(data.columns.slice(1))(data))
        .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function (d) {
            return colors(d.key);
        })

    serie.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("y", function (d) {
            return y(d.data.Company);
        })
        .attr("width", function (d) {
            return x(d[1]) - x(d[0]);
        })
        .attr("height", y.bandwidth());
});

function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}
