// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
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
    // set the ranges
    var xScale = d3.scaleLinear()
    .domain([d3.min(healthdata,d=>d.poverty),d3.max(healthdata,d=>d.poverty)]).nice()
    .range([0, width]);
    
    var yScale = d3.scaleLinear()
    .domain([d3.min(healthdata,d=>d.healthcare),d3.max(healthdata,d=>d.healthcare)]).nice()
    .range([height, 0]);
    //x.domain(d3.extent(healthdata, function(data) { return data.healthcare; })).nice();
    //y.domain(d3.extent(healthdata, function(data) { return data.poverty; })).nice();

    // Add the X Axis
    chartGroup.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // Add the Y Axis
    chartGroup.append("g")
      .call(d3.axisLeft(yScale));

  /*  // Add the valueline path.
    svg.append("path")
        .data([healthdata])
        .attr("class", "line")
        .attr("d", valueline); */
    
    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
    .domain(["setosa", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

    // Add the scatterplot
    chartGroup.selectAll("circle")
        .data(healthdata)
        .enter().append("circle")
        .attr("r", 10)
        .attr("cx", function(data) { return xScale(data.poverty); })
        .attr("cy", function(data) { return yScale(data.healthcare); })
        .style('fill',d=>{return color(d.poverty)})
        //.attr("opacity", "0.5")
        //.attr("class", "stateCircle")
        //.attr("stroke", "black");

   
});
