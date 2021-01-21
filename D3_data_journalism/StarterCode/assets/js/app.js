// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 900;
var svgHeight = 400;

var margin = {
  top: 10,
  right: 30,
  bottom: 40,
  left: 50,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from hours-of-tv-watched.csv
d3.csv("./assets/data/data.csv").then(function(healthdata) {

    console.log(healthdata);
   
    // format the data
    healthdata.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
        console.log("Healthcare", data.healthcare);
        console.log("Poverty", data.poverty);
        //console.log('smokes',data.smokes);
        //console.log('age',data.age);
    });

    // Scale the range of the data
    var xScale = d3.scaleLinear()
    .domain([d3.min(healthdata,d=>d.poverty),d3.max(healthdata,d=>d.poverty)]).nice()
    .range([0, width]);
    
    // Add the X Axis
    chartGroup.append("g")
      .attr("class", "myXaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // set the y range 
    var yScale = d3.scaleLinear()
    .domain([d3.min(healthdata,d=>d.healthcare),d3.max(healthdata,d=>d.healthcare)]).nice()
    .range([height, 0]);

    // Add the Y Axis
    chartGroup.append("g")
      .call(d3.axisLeft(yScale));  


    //xScale.domain(d3.extent(healthdata, function(data) { return data.healthcare; })).nice();
    //yScale.domain(d3.extent(healthdata, function(data) { return data.poverty; })).nice();

    // tick line Customization
    chartGroup.selectAll('.tick line').attr('stroke','red');  

    // Add X axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left + 40)
    .attr("y", height + margin.top + 30)
    .style("font-weight", 'bold')
    .text("In Poverty (%)")
    .style('fill','Blue');

    // Y axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 30)
      .attr("x", -margin.top - height/2 +80)
      .style("font-weight", 'bold')
      .text("Lacks Healthcare (%)")
      .style('fill','Blue');

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select('#scatter')
      .append('div')
      .style('opacity',0)
      .attr('class','tooltip')
      .style('background-color','lightblue')
      .style('border','solid')
      .style('border-width','1px')
      .style('border-radius','5px')
      .style('padding','5px')
   
    /*  var toolTip = d3.tip()
    .attr('class','d3-tip')
    .offset([0,0])
    .html(function(d){
        return (`<strong>${d.state}</br></br>Lacks Healthcare (%):</br>${d.healthcare}</br></br>Poverty (%):</br> ${d.poverty}<strong>`);
    });
    svg.call(toolTip);*/
    var mouseover = function(d){
      tooltip.style('opacity',1)
    }

    var mousemove = function(d){
      tooltip
      .html('Poverty:'+d.poverty+'<br>'+
      'Healthcare:'+d.healthcare)
      .style("left", (d3.mouse(this)[0]+90) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }
    // Add the scatterplot
    chartGroup.selectAll("circle")
        .data(healthdata)
        .enter()
        .append("circle")
          .attr("r", 10)
          .attr("cx", data=>xScale(data.poverty))
          .attr("cy", data=>yScale(data.healthcare))
          .style('fill','#69b3a2')
        .on('mouseover',mouseover)
        .on('mousemove',mousemove)
        .on('mouseleave',mouseleave)
    
    // State Abbreviation in the Cirles
    chartGroup.append("text")
        .attr("class", "statetext")
        .style("font-size", '8')
        .style("font-weight", 'bold')
        .selectAll('tspan')
        .data(healthdata)
        .enter()
        .append('tspan')
          .attr("x", data=>xScale(data.poverty -0.1))
          .attr("y", data=>yScale(data.healthcare -0.1))
          .text(data=>data.abbr)

          
}).catch(function(error) {
  console.log(error);

});
