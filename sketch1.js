var sketch1 = (function () { //use IIFE to avoid variable name collision

    // set the dimensions and margins of the graph
    var margin = {
            top: 25,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the 1st line
    var menLine = d3.line()
        .x(function (d) {
            return x(d.Year);
        })
        .y(function (d) {
            return y(d.men);
        });

    // define the 2nd line
    var womenLine = d3.line()
        .x(function (d) {
            return x(d.Year);
        })
        .y(function (d) {
            return y(d.women);
        });

    var svg = d3.select("#plot1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("wage_average_over_time.csv", type, function (error, data) {
        if (error) throw error;

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.Year;
        }));
        y.domain([800, 1600]);

        // Add the X Axis
        var axisX = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "axisX")
            .call(d3.axisBottom(x)
                  .ticks(20).tickFormat(d3.format("d")));

        // Add the Y Axis
        var axisY = svg.append("g")
            .attr("class", "axisY")
            .call(d3.axisLeft(y).ticks(10));

        // add the X gridlines
        var gridX = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .ticks(20)
                .tickSize(-height)
                .tickFormat("")
            ).selectAll("line").style("stroke", "#ccc");

        gridX.selectAll(".tick").on("mousemove", function (d) {
                toolTip
                    .style("left", d3.event.pageX - 25 + "px")
                    .style("top", d3.event.pageY - 40 + "px")
                    .style("display", "inline-block")

                toolTip.html("$" + d.women);
            })
            .on("mouseout", function (d) {
                hover.style("display", "none");
            })

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickSize(-width)
                .tickFormat("")
            ).selectAll("line").style("stroke", "#ccc");

        // Add the line path.
        var orangeLine = svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("fill", "none")
            .style("opacity", 0)
            .style("stroke", "#ff7b5c").style("stroke-width", 2)
            .attr("d", menLine)
            .attr("stroke-dasharray", 1000 + ", " + 1000)
            .attr("stroke-dashoffset", 1000)
            .transition()
            .duration(3000)
            .style("opacity", 1)
            .attr("stroke-dashoffset", 0);

        // Add the line2 path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("fill", "none")
            .style("opacity", 0)
            .style("stroke", "#007f75").style("stroke-width", 2)
            .attr("d", womenLine)
            .attr("stroke-dasharray", 1000 + ", " + 1000)
            .attr("stroke-dashoffset", 1000)
            .transition()
            .duration(3000)
            .style("opacity", 1)
            .attr("stroke-dashoffset", 0);

        svg.selectAll(".tick")
            .each(function (d) {
                if (d === 0) {
                    this.remove();
                }
            });

        // remove axis path
        axisX.selectAll("path").style("stroke", "transparent");
        axisY.selectAll("path").style("stroke", "transparent");

        axisY.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -4)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Median Weekly Earning ($)")
            .style("font-size", "12px");

        // Style the axis text
        axisX.selectAll("text")
            .style("fill", "#282828")
            .attr("font-size", "15px")
            .attr("font-family", "Work Sans");

        axisY.selectAll("text")
            .style("fill", "#282828")
            .attr("font-size", "15px")
            .attr("font-family", "Work Sans");

        //add dots 
        var plotDotsMales = svg.append("g").attr("class", "dots");

        plotDotsMales
            .selectAll(".maleDots")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "maleDots")
            .attr("cx", function (d) {
                return x(d.Year)
            })
            .attr("cy", function (d) {
                return y(d.men)
            })
            .attr("r", 5).on("mousemove", function (d) {
                hover
                    .style("left", d3.event.pageX - 25 + "px")
                    .style("top", d3.event.pageY - 40 + "px")
                    .style("display", "inline-block")

                hover.html("$" + d.men);
            })
            .on("mouseout", function (d) {
                hover.style("display", "none");
            });


        var plotDotsFemales = svg.append("g").attr("class", "dots")

        plotDotsFemales
            .selectAll(".femaleDots")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "femaleDots")
            .attr("cx", function (d) {
                return x(d.Year)
            })
            .attr("cy", function (d) {
                return y(d.women)
            })
            .attr("r", 5)
            .on("mousemove", function (d) {
                hover
                    .style("left", d3.event.pageX - 25 + "px")
                    .style("top", d3.event.pageY - 40 + "px")
                    .style("display", "inline-block")

                hover.html("$" + d.women);
            })
            .on("mouseout", function (d) {
                hover.style("display", "none");
            });
    });

    svg.selectAll("text")
        .style("fill", "#282828")
        .attr("font-size", "15px")
        .attr("font-family", "Work Sans");

    function type(d, i, columns) {
        for (var i = 0, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
    }

    var hover = d3.select("#plot1").append("div")
        .attr("class", "hover")
        .style("display", "none");

    var toolTip = d3.select("#plot1").append("div")
        .attr("class", "toolTip")
        .style("display", "none");

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform",
            "translate(" + (width - 50) + "," + (-15) + ")");

    legend.append("circle")
        .attr("r", 5)
        .style("fill", "#ff7b5c").attr("transform",
            "translate(-87,0)");

    legend.append("text").text("Men")
        .attr("transform", "translate(-75,5)");

    legend.append("circle")
        .attr("r", 5)
        .style("fill", "#007f75")
        .attr("transform", "translate(-20,0)");

    legend.append("text").text("Women")
        .attr("transform", "translate(-8,5)");
})();

sketch1;
