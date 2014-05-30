// based on https://github.com/gajus/pie-chart (pie chart plugin)
$(function(){
	ay.pie_chart('testpie', [{index:1,value:1390,name:"African-American"}, {index:2,value:580,name:"American Indian"}, {index:3,value:9866,name:"Asian"}, 
		{index:4,value:20998,name:"Caucasian"}, {index:5,value:345,name:"Hawaiian/Pacific Islander"}, {index:6,value:2788,name:"Hispanic/Latino"},
		{index:7,value:6252,name:"International"}, {index:8,value:1543,name:"Not Indicated"}], [{radius_inner: 50}, {percentage:false}]);
});