// student data pie chart javascript
// based on http://bl.ocks.org/dbuezas/9306799
jQuery(document).ready(function ($) {

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2
    labelr = radius + 30; // radius for label anchor

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

// you can mess with these values
var outerArc = d3.svg.arc()
	.innerRadius(radius + 10)
	.outerRadius(radius + 80);

var outerPos = d3.svg.arc()
	.innerRadius(radius + 20).outerRadius(radius + 20);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.y2012; });

var key = function(d){ return d.data.stype; };

var svg = d3.select(".piechart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


// create chart from student data
d3.csv("studentdata.csv", type, function(error, data) {

 var path = svg.datum(data).selectAll("path")
      .data(pie)
    .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .each(function(d) { this._current = d; }); // store the initial angles

 var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  // add text labels
  g.append("text")
      .attr("transform", function(d) {
    	var c = arc.centroid(d),
        	x = c[0],
       		y = c[1],
        	// pythagorean theorem for hypotenuse
          // this repeats three times, couldn't figure out how to just call it
          // determines whether to add outside label and polyline based on slice width
        	h = Math.sqrt(x*x + y*y);
        if (x/y > 1) {
    	return "translate(" + (x/h * labelr) +  ',' +
       		(y/h * labelr) +  ")"; 
		} else {
      	return "translate(" + arc.centroid(d) + ")";
      }})
      	.attr("text-anchor", function(d) {
      		var c = arc.centroid(d),
        	x = c[0],
       		y = c[1],
        	// pythagorean theorem for hypotenuse
        	h = Math.sqrt(x*x + y*y);
        if (x/y < 1) {
        		return "middle";
		} else {
			// are we past the center?
    		return (d.endAngle + d.startAngle)/2 > Math.PI ?
        		"end" : "start";
			}})
      .attr("class", "value")
      .text(function(d) { return d.data.stype; });
    // polylines / labels do not change at this point when slices do
    // example of polyline changes: http://bl.ocks.org/dbuezas/9306799
    g.append("polyline")
		.attr("points", function(d){
		var c = arc.centroid(d),
        	x = c[0],
       		y = c[1],
        	// pythagorean theorem for hypotenuse
        	h = Math.sqrt(x*x + y*y);
        if (x/y > 1) {
		return [arc.centroid(d), outerPos.centroid(d)];	
		} else {
			return null;
		}
	});
function alertChange () {
    //get the data value and index from the event
    var selectedValue = d3.event.target.value;
    return selectedValue;
}

// animation from selection event triggers based on: http://bl.ocks.org/mbostock/1346410
// event listener for menu:
d3.select("#year-list")
	.on("change", function(){
		pieChange(alertChange());
	});

	function pieChange(year) {
		var value = year;
		pie.value(function(d) {return d[value]; });
		path = path.data(pie); // compute the new angles
    	path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
	}
});

function type(d){
    d.y2009 = +d.y2009;
    d.y2010 = +d.y2010;
    d.y2011 = +d.y2011;
    d.y2012 = +d.y2012;
    return d;
  }

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}
});