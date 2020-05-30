
/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

    //Define Margin
var margin = {top: 0, right: 80, bottom: 50, left: 100},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    //Define SVG
var svg = d3.select("body")//add to the html body
        .append("svg")
        .attr("width", width + margin.left + margin.right)//add margins to total width
        .attr("height", height + margin.top + margin.bottom)//add margins to toal height
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");//position graph between margin


            
//draw map stuff
var projection = d3.geoMercator()//flat world map projection
            .center([50,15])//coordinates taken from http://bl.ocks.org/asifsalam/raw/681a06e4a37b7b1e3cf6/
            .scale(3000)//zoom in on the country
            .translate([width / 2, height / 2])

var path = d3.geoPath().projection(projection);//create path with projection
var den = [1,50,100,300,1000,3000,5000,10000]
var pop = [10000,50000,100000,500000,1000000,2000000,5000000,10000000]
var color = d3.scaleThreshold()
            .range(d3.schemeReds[9])
            .domain(den)

var districts = {}
var tooltip = d3.select("body")
        .append("div")
        .attr("class","tooltip")//make tooltip invisible initally
        .attr("opacity",0);

//make legend 
function drawLegend(color,dom){

var y = 10;
svg.append('g')
    .attr('class','legend')
    .selectAll('rect')
    .data(dom)
    .enter()
    .append('rect')
    .attr('height', 150)
    .attr('width', 150)
    .attr('y', 0)
    .attr('x',0)
    .style('fill','white');
    
if( dom[0] ==  1){
    svg.append('g')
    .attr('class','legend')
    .selectAll('text')
    .data(dom)
    .enter()
    .append('text')
    .style("text-anchor", "start")
    .attr('y', 10)
    .attr('x',20)
    .style('fill','black')
    .text('people per square km')

}else{
    svg.append('g')
    .attr('class','legend')
    .selectAll('text')
    .data(dom)
    .enter()
    .append('text')
    .style("text-anchor", "start")
    .attr('y', 10)
    .attr('x',20)
    .style('fill','black')
    .text('population per region')
}
svg.append('g')
    .attr('class','legend')
    .selectAll('rect')
    .data(dom)
    .enter()
    .append('rect')
    .attr('height', 10)
    .attr('width', 10)
    .attr('y', function(){return y+=10})
    .attr('x',0)
    .style('fill',function(d){return color(d)});
y=20;
svg.append('g')
    .attr('class','legend')
    .selectAll('text')
    .data(dom)
    .enter()
    .append('text')
    .style("text-anchor", "start")
    .attr('y', function(){return y+=10})
    .attr('x',20)
    .style('fill','black')
    .text(function(d){return d})
}



d3.json('Yemen.json').then(function(yemen) {
    d3.csv('Yemen.csv').then(function(yemPop){
        
        drawLegend(color,den);
        
        districts = yemen.features;
        console.log(districts);
        console.log(yemPop.length);
        console.log(districts.length);
        for (var i=0; i < yemPop.length; ++i){
            var name = yemPop[i].district;
            
            for (var j=0; j < districts.length; ++j){
                if (name == districts[j].properties.NAME_1){
                    districts[j].properties.density = yemPop[i].density;
                    districts[j].properties.area = parseInt(yemPop[i].area);
                    districts[j].properties.population =parseInt(yemPop[i].pop);

                }
                
            }
            
        }
        console.log(districts)


    
        svg.append('g').selectAll('path')
            .data(districts)
            .enter()
            .append('path')
            .attr('d',path)
            .style('fill',function(d){return color(d.properties.density)})
            .style('stroke', 'black')
            .on("mouseover",function(d){//add tooltip when mouse in dot area
            tooltip.transition()//fade on
                .duration("200")
                .style("opacity",1);
            tooltip.html(//create tooltip table for data (five rows with two collumns)
                '<table width="100%" height="100%"><tr><th colspan="2" style="text-right:center">'+d.properties.NAME_1+'</th></tr>'
                +'<tr><td style="text-align:left">'+ 'Population:'+'</td>'+
                '<td style="text-align:right">'+d.properties.population+'</td></tr>'
                +'<tr><td style="text-align:left">'+ 'Area:'+'</td>'+
                '<td style="text-align:right">'+d.properties.area+' Km<sup>2</sup>'+'</td></tr>'
                +'<tr><td style="text-align:left">'+ 'denisity:'+'</td>'+
                '<td style="text-align:right">'+d.properties.density+'</td></tr></table>'
            )
                .style("left",(d3.event.pageX)+"px")//set position to mouse x when entering the circle
                .style("top",(d3.event.pageY-28)+"px");})//set position to mouse y when entering the circle
        .on("mouseout",function(){//take away info when mouse not on a circle
            tooltip.transition()
            .duration(500)
            .style("opacity",0);
        })
        
        
    })
});
function showPop(){
    var colorB = d3.scaleThreshold()
            .range(d3.schemeBlues[8])
            .domain(pop)
    drawLegend(colorB,pop)
    svg.append('g').selectAll('path')
            .data(districts)
            .enter()
            .append('path')
            .attr('d',path)
            .style('fill',function(d){return colorB(d.properties.population)})
            .style('stroke', 'black')
            .on("mouseover",function(d){//add tooltip when mouse in dot area
            tooltip.transition()//fade on
                .duration("200")
                .style("opacity",1);
            tooltip.html(//create tooltip table for data (five rows with two collumns)
                '<table width="100%" height="100%"><tr><th colspan="2" style="text-right:center">'+d.properties.NAME_1+'</th></tr>'
                +'<tr><td style="text-align:left">'+ 'Population:'+'</td>'+
                '<td style="text-align:right">'+d.properties.population+'</td></tr>'
                +'<tr><td style="text-align:left">'+ 'Area:'+'</td>'+
                '<td style="text-align:right">'+d.properties.area+' Km<sup>2</sup>'+'</td></tr>'
                +'<tr><td style="text-align:left">'+ 'denisity:'+'</td>'+
                '<td style="text-align:right">'+d.properties.density+'</td></tr></table>'
            )
                .style("left",(d3.event.pageX)+"px")//set position to mouse x when entering the circle
                .style("top",(d3.event.pageY-28)+"px");})//set position to mouse y when entering the circle
        .on("mouseout",function(){//take away info when mouse not on a circle
            tooltip.transition()
            .duration(500)
            .style("opacity",0);
        })
    


}
function showDensity(){
    drawLegend(color,den)
    svg.append('g').selectAll('path')
            .data(districts)
            .enter()
            .append('path')
            .attr('d',path)
            .style('fill',function(d){return color(d.properties.density)})
            .style('stroke', 'black')
            .on("mouseover",function(d){//add tooltip when mouse in dot area
            tooltip.transition()//fade on
                .duration("200")
                .style("opacity",1);
            tooltip.html(//create tooltip table for data (five rows with two collumns)
                '<table width="100%" height="100%"><tr><th colspan="2" style="text-right:center">'+d.properties.NAME_1+'</th></tr>'
                +'<tr><td style="text-align:left">'+ 'Population:'+'</td>'+
                '<td style="text-align:right">'+d.properties.population+'</td></tr>'
                +'<tr><td style="text-align:left">'+ 'Area:'+'</td>'+
                '<td style="text-align:right">'+d.properties.area+' Km<sup>2</sup>'+'</td></tr>'
                +'<tr><td style="text-align:left">'+ 'denisity:'+'</td>'+
                '<td style="text-align:right">'+d.properties.density+'</td></tr></table>'
            )
                .style("left",(d3.event.pageX)+"px")//set position to mouse x when entering the circle
                .style("top",(d3.event.pageY-28)+"px");})//set position to mouse y when entering the circle
        .on("mouseout",function(){//take away info when mouse not on a circle
            tooltip.transition()
            .duration(500)
            .style("opacity",0);
        })
}
