// stacked bar chart
// based on http://bl.ocks.org/mbostock/1134768
jQuery(document).ready(function ($) {
var w = 450,
    h = 500,
    p = [20, 50, 30, 20],
    x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
    y = d3.scale.linear().range([0, h - p[0] - p[2]]),
    z = d3.scale.ordinal().range(["#8a89a6", "#7b6888", "#a05d56", "#d0743c", "#ff8c00"]) //color range. change to desired colors if needed
    parse = d3.time.format("%m/%Y").parse,
    format = d3.time.format("%b"); // residual from original example, but good for date time parsing

var svg = d3.select(".stackbar").append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

d3.csv("stackdata.csv", function(total) {

  var allCost = d3.keys(total[0]).filter(function(key) { return key !== "stype"; });

  // Transpose the data into layers by costs.
  var costs = d3.layout.stack()(["Tuition & Fees","Room & Board","Books & Supplies","Personal Expenses","Transport"].map(function(cost) {
    return total.map(function(d) {
      return {x: parse(d.stype), y: +d[cost]};
    });
  }));

  // Compute the x-domain (by date) and y-domain (by top).
  x.domain(costs[0].map(function(d) { return d.x; }));
  y.domain([0, d3.max(costs[costs.length - 1], function(d) { return d.y0 + d.y; })]);

  // Add a group for each cost.
  var cost = svg.selectAll("g.cost")
      .data(costs)
    .enter().append("svg:g")
      .attr("class", "cost")
      .style("fill", function(d, i) { return z(i); })
      .style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

  // Add a rect for each student type.
  var rect = cost.selectAll("rect")
      .data(Object)
    .enter().append("svg:rect")
      .attr("x", function(d) { return x(d.x) + 80; })
      .attr("y", function(d) { return -y(d.y0) - y(d.y); })
      .attr("height", function(d) { return y(d.y); })
      .attr("width", x.rangeBand()/2);

  // Position a label per student type.
  var label = svg.selectAll("text")
      .data(x.domain())
    .enter().append("svg:text")
      .attr("x", function(d) { return x(d) + x.rangeBand() - 65; })
      .attr("y", 6)
      .attr("text-anchor", "middle")
      .attr("dy", ".71em")
      .attr ("class", "stext");

  // Add label text
  var labelt = svg.selectAll(".stext")
      .data(["Resident", "Nonresident"])
      .text(function(d) { return d; });

  // Add y-axis rules.
  var rule = svg.selectAll("g.rule")
      .data(y.ticks(5))
    .enter().append("svg:g")
      .attr("class", "rule")
      .attr("transform", function(d) { return "translate(0," + -y(d) + ")"; });

  rule.append("svg:text")
      .attr("x", w - p[1] - p[3] + 6)
      .attr("dy", ".35em")
      .text(d3.format("$,d"));

// Add legend for cost category, since original example didn't have one.
// based on the Admission Breakdown legend
 var legend = svg.selectAll(".legend")
      .data(allCost.slice())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", 10)
      .attr("y", -440)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d, i) { return z(i); })

  legend.append("text")
      .attr("x", 30)
      .attr("y", -430)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .attr("class", "value")
      .text(function(d) { return d; });
});

// alert works right now, but bars don't change
// leaving alert code in case you want to implement
function alertChange () {
    //get the data value and index from the event
    var selectedValue = d3.event.target.value;
    return selectedValue;
}

// event listener for menu:
d3.select("#year-list2")
  .on("change", function(){
    barChange(alertChange());
  });

  function barChange(year) {
    svg.selectAll(".stext").transition()
      .duration(750)
      .attr("text", year);
  }

});