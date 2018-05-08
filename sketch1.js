var sketch1 = (function () { //use IIFE to avoid variable name collision

    // set the dimensions and margins of the graph
    var margin = {
            top: 25,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 900 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        bisectDate = d3.bisector(function (d) {
            return d.Year;
        }).left;

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

    var bg = svg.append("rect")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform",
            "translate(" + (-margin.left) + "," + (-margin.top) + ")")
        .attr("fill", "transparent");

    var gridX, gridY, axisX, axisY, plotDotsMales, plotDotsFemales;

    var xValues = [];


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
        gridX = svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x)
                .ticks(20)
                .tickSize(-height)
                .tickFormat("")
            ).data(data)

        gridX.selectAll("g").each(function (d) {
            var positionString = ((d3.select(this).attr("transform")));
            var commaIndex = positionString.indexOf(",");
            var xPos = parseFloat(positionString.substring(10, commaIndex));
            xValues.push(xPos);
        });

        // add the Y gridlines
        gridY = svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickSize(-width)
                .tickFormat("")
            ).selectAll("line").style("stroke", "#ccc");

        // Add the X Axis
        axisX = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "axisX")
            .call(d3.axisBottom(x)
                .ticks(20).tickFormat(d3.format("d")));

        // Add the Y Axis
        axisY = svg.append("g")
            .attr("class", "axisY")
            .call(d3.axisLeft(y).ticks(10));

        axisY.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -4)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Median Weekly Earning ($)")
            .style("font-size", "12px");

        svg.on("mousemove", function (d) {
                var coords = d3.mouse(this);

                var index = tooltipLinePos(d3.event.pageX - 300);
                var yPos = coords[1];
                if (yPos < 52.28) {
                    yPos = 52.28;
                };

                tooltipLine
                    .attr("transform", "translate(" + xValues[index] + ",0)")
                    .transition().duration(100)
                    .style("opacity", "1");

                tooltip
                    .style("left", (xValues[index] + 320) + "px")
                    .style("top", 795 + yPos + "px")
                    .style("display", "block")
                    .html('Women earned<br><span class="gap">' +
                        Math.floor(data[index].women / data[index].men * 100) + "%</span>" +
                        "<br>of men's wage.");
            })
            .on("mouseout", function (d) {
                tooltipLine
                    .transition().duration(100)
                    .style("opacity", "0");

                tooltip.style("display", "none");
            });

        var tooltipLine = svg.append("rect")
            .attr("class", "tooltipline")
            .attr("width", 1)
            .attr("height", height)
            .style("stroke", "#3c3c3c")
            .style("stroke-width", 1)
            .attr("opacity", "0");

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

        //add dots 
        plotDotsMales = svg.append("g").attr("class", "dots");

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
            .attr("r", 5)
            .on("mousemove", function (d) {
                valueLabel
                    .style("left", d3.event.pageX - 25 + "px")
                    .style("top", d3.event.pageY - 40 + "px")
                    .style("display", "inline-block")

                valueLabel.html("$" + d.men);
            })
            .on("mouseout", function (d) {
                valueLabel.style("display", "none");
            });


        plotDotsFemales = svg.append("g").attr("class", "dots")

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
                valueLabel
                    .style("left", d3.event.pageX - 25 + "px")
                    .style("top", d3.event.pageY - 40 + "px")
                    .style("display", "inline-block")

                valueLabel.html("$" + d.women);
            })
            .on("mouseout", function (d) {
                valueLabel.style("display", "none");
            });

        var styling = (function () {
            svg.selectAll("text")
                .style("fill", "#282828")
                .attr("font-size", "15px")
                .attr("font-family", "Work Sans");

            gridX.selectAll("line").style("stroke", "#ccc");

            // remove axis path
            axisX.selectAll("path").style("stroke", "transparent");
            axisY.selectAll("path").style("stroke", "transparent");

            //remove the first element of y axis text
            axisY.select("text").remove();
        })();

        styling;
    });

    function type(d, i, columns) {
        for (var i = 0, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
    }

    var valueLabel = d3.select("#plot1").append("div")
        .attr("class", "valueLabel")
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

    var tooltip = d3.select("#plot1").append("div")
        .attr("class", "toolTip")
        .style("display", "none");

    function tooltipLinePos(mouseX) {
        var closestIndex = 0;
        for (var i = 0; i < xValues.length; i++) {
            if (Math.abs(xValues[i] - mouseX) < Math.abs(xValues[closestIndex] - mouseX)) {
                closestIndex = i;
            }
        }
        return closestIndex;
    }
})();

sketch1;
