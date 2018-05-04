var sketch1 = (function () { //use IIFE to avoid variable collision

    // set the dimensions and margins of the graph
    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#plot1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + width + ")")
        .call(d3.axisBottom(x)
            .ticks(10)
            .tickSize(-width)
            .tickFormat("")
        ).selectAll("line").style("stroke", "#ccc");

    // Get the data
    d3.csv("wage_average_over_time.csv", type, function (error, data) {
        console.log(data);
        if (error) throw error;

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.Year;
        }));
        y.domain([0, d3.max(data, function (d) {
            return Math.max(d.women, d.men);
        })]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("fill", "none")
            .style("stroke", "ff7b5c").style("stroke-width", 2)
            .attr("d", menLine);

        // Add the valueline2 path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("fill", "none")
            .style("stroke", "007f75").style("stroke-width", 2)
            .attr("d", womenLine);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
        
        //add dots 
        var plotDotsMales = svg.append("g").attr("class", "dots");
        
        
        plotDotsMales 
            .selectAll(".maleDots")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "maleDots")
            .attr("cx", function(d){ return x(d.Year)})
            .attr("cy", function(d){ return y(d.men)})
            .attr("r", 5);
        
        
        var plotDotsFemales = svg.append("g").attr("class", "dots")
        
        plotDotsFemales
            .selectAll(".femaleDots")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "femaleDots")
            .attr("cx", function(d){ return x(d.Year)})
            .attr("cy", function(d){ return y(d.women)})
            .attr("r", 5);
        
    });

    var parseTime = d3.timeParse("%Y%m%d");

    svg.selectAll("text")
        .style("fill", "#282828")
        .attr("font-size", "15px")
        .attr("font-family", "Work Sans");

    function type(d, i, columns) {
        for (var i = 0, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
        return d;
    }
})();

sketch1;
