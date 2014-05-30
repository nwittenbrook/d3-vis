// seattle rankings javascript

jQuery(document).ready(function ($) {
	var data = [{"label":"Miami", "value":61.9}, 
            {"label":"Houston", "value":44.8}, 
            {"label":"NY", "value":44.1},
            {"label":"Seattle", "value":38.6},
            {"label":"Chicago", "value":33.1},
            {"label":"SF", "value":20.78},
            {"label":"LA", "value":12.1},
            ];

    //maximum of data you want to use
    var data_max = 80,

    //number of tickmarks to use
    num_ticks = 5,

    //margins
    left_margin = 80,
    right_margin = 80,
    top_margin = 30,
    bottom_margin = 0;


    var w = 500,                        //width
        h = 500,                        //height
        color = function(id) { return '#7b6888' };

    var x = d3.scale.linear()
        .domain([0, data_max])
        .range([0, w - ( left_margin + right_margin ) ]),
        y = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([bottom_margin, h - top_margin], .5);


    var chart_top = h - y.rangeBand()/2 - top_margin;
    var chart_bottom = bottom_margin + y.rangeBand()/2;
    var chart_left = left_margin;
    var chart_right = w - right_margin;

    /*
     *  Setup the SVG element and position it
     */
    var vis = d3.select(".rainbar")
        .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
        .append("svg:g")
            .attr("id", "barchart")
            .attr("class", "barchart")


    //Ticks
    var rules = vis.selectAll("g.rule")
        .data(x.ticks(num_ticks))
    .enter()
        .append("svg:g")
        .attr("transform", function(d)
                {
                return "translate(" + (chart_left + x(d)) + ")";});
    rules.append("svg:line")
        .attr("class", "tick")
        .attr("y1", chart_top)
        .attr("y2", chart_top + 4)
        .attr("stroke", "black");

    rules.append("svg:text")
        .attr("class", "tickLabel")
        .attr("text-anchor", "middle")
        .attr("y", chart_top)
        .text(function(d)
        {
        return d;
        });
    var bbox = vis.selectAll(".tickLabel").node().getBBox();
    vis.selectAll(".tickLabel")
    .attr("transform", function(d)
            {
            return "translate(0," + (bbox.height) + ")";
            });

    var bars = vis.selectAll("g.bar")
        .data(data)
    .enter()
        .append("svg:g")
            .attr("class", "bar")
            .attr("transform", function(d, i) { 
                    return "translate(0, " + y(i) + ")"; });

    bars.append("svg:rect")
        .attr("x", right_margin)
        .attr("width", function(d) {
                return (x(d.value));
                })
        .attr("height", y.rangeBand())
        .attr("fill", color(0))
        .attr("class", function(d) {
        	if (d.value == 38.6) {
       			return 'seattleBar';
      		} else {
        		return '';
      		}})
        .attr("stroke", color(0));


    //Labels
    var labels = vis.selectAll("g.bar")
        .append("svg:text")
            .attr("class", "barLabel")
            .attr("x", 0)
            .attr("text-anchor", "left")
            .text(function(d) {
                    return d.label;
                    });

    var bbox = labels.node().getBBox();
    vis.selectAll(".barLabel")
        .attr("transform", function(d) {
                return "translate(0, " + (y.rangeBand()/2 + bbox.height/4) + ")";
                });


    labels = vis.selectAll("g.bar")
        .append("svg:text")
        .attr("class", "value")
        .attr("x", function(d)
                {
                return x(d.value) + right_margin + 10;
                })
        .attr("text-anchor", "right")
        .text(function(d)
        {
        return "" + d.value + "\"";
        });

    bbox = labels.node().getBBox();
    vis.selectAll(".value")
        .attr("transform", function(d)
        {
            return "translate(0, " + (y.rangeBand()/2 + bbox.height/4) + ")";
        });

    //Axes
    vis.append("svg:line")
        .attr("class", "axes")
        .attr("x1", chart_left)
        .attr("x2", chart_left)
        .attr("y1", chart_bottom)
        .attr("y2", chart_top)
        .attr("stroke", "black");
     vis.append("svg:line")
        .attr("class", "axes")
        .attr("x1", chart_left)
        .attr("x2", chart_right)
        .attr("y1", chart_top)
        .attr("y2", chart_top)
        .attr("stroke", "black");
});
