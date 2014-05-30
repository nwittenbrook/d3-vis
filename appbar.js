// grouped bar chart
// based on http://bl.ocks.org/mbostock/3887051
jQuery(document).ready(function ($) {
var margin = {top: 20, right: 20, bottom: 50, left: 70},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var bd3 = d3;

var x0 = bd3.scale.ordinal()
    .rangeRoundBands([0, width], .6);

var x1 = bd3.scale.ordinal();

var y = bd3.scale.linear()
    .range([height, 0])

// color range. Change values to change colors
var color = bd3.scale.ordinal()
    .range(["#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = bd3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = bd3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(bd3.format(".2s"));

// Appends svg to div with id 'appbar'. You can also append to body
var svg = bd3.select(".appbar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// pulls data from csv file appdata.csv
bd3.csv("appdata.csv", function(error, data) {
  var appNames = bd3.keys(data[0]).filter(function(key) { return key !== "Applicants"; }); // gets only keys "applied," "admitted," and "enrolled"

  data.forEach(function(d) {
    d.appCat = appNames.map(function(name) { return {name: name, value: +d[name]}; }); // gets name and values for the applicant statuses
  });

  x0.domain(data.map(function(d) { return d.Applicants; }));
  x1.domain(appNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, bd3.max(data, function(d) { return bd3.max(d.appCat, function(d) { return d.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)") // rotates text horizontally
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Applicants"); // adds label "Applicants" to y-axis. Change this to whatever you want

  var apptype = svg.selectAll(".applicants") // get the groups of applicant types
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.Applicants) + ",0)"; });

  apptype.selectAll("rect")
      .data(function(d) { return d.appCat; })
    .enter().append("rect") // configure bar groups
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  svg.selectAll("text")
       .attr("class", "value");

  // configures legend in upper right hand corner with rectangle keys
  var legend = svg.selectAll(".legend")
      .data(appNames.slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .attr("class", "value")
      .text(function(d) { return d; });

});
});