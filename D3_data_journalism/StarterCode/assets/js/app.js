// svg container
var svgWidth = 900;
var svgHeight = 400;


var margin = {
  top: 10,
  right: 30,
  bottom: 40,
  left: 50,
};


// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#scatter")
.append("svg")
.attr("viewBox", "0 0 " + svgWidth + " " + svgHeight ) //for window responsive
.attr("preserveAspectRatio", "xMidYMid meet");

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
// Load data for D3 Journalism data
d3.csv("assets/data/data.csv").then(function(censusData) {

  // Data
  console.log(censusData);

  // Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

  // Create scale functions
    // ==============================
  
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare) -2, d3.max(censusData, d => d.healthcare) + 2])
    .range([chartHeight, 0]);
    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty) - 1, d3.max(censusData, d => d.poverty) + 1])
      .range([0, chartWidth]);

  // Step 3: Create axis functions
    // ==============================
    var yAxis = d3.axisLeft(yLinearScale);
    var xAxis = d3.axisBottom(xLinearScale);
    
  // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

  // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("r", "10")
      //.attr("opacity", "0.75")
      //.attr("class", "stateCircle")
      //.attr("stroke", "black")
      .style('fill','#69b3a2');


  // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([0, 0])
      .html(function(d) {
        return ('State:' + d.state+'<br>'+'Poverty:'+d.poverty+'<br>'+
        'Healthcare:'+d.healthcare);})
      .style("left", (d3.mouse[0]+90) + "px")		
      .style("top", (d3.mouse[1]) + "px");	
  
      // Create tooltip in the chart
  // ==============================
    svg.call(toolTip);

  // Create event listeners to display and hide the tooltip
  // ==============================
    // mouseclick event
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    });
    // onmouseover event
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    });
    // onmouseout event
    circlesGroup.on("mouseout", function(data) {
      toolTip.hide(data, this);
    });

  
    // tick line Customization
    chartGroup.selectAll('.tick line').attr('stroke','red');  

    // Add X axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x",chartWidth/2 + margin.left + 40)
    .attr("y", chartHeight + margin.top + 30)
    .style("font-weight", 'bold')
    .text("In Poverty (%)")
    .style('fill','Blue');

    // Y axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 30)
      .attr("x", -margin.top - chartHeight/2 +80)
      .style("font-weight", 'bold')
      .text("Lacks Healthcare (%)")
      .style('fill','Blue');
    
    // State Abbreviation in the Cirles
    chartGroup.append("text")
        .attr("class", "statetext")
        .style("font-size", '8')
        .style("font-weight", 'bold')
        .selectAll('tspan')
        .data(censusData)
        .enter()
        .append('tspan')
          .attr("x", data=>xLinearScale(data.poverty -0.1))
          .attr("y", data=>yLinearScale(data.healthcare -0.1))
          .text(data=>data.abbr)
   
    
}).catch(function(error) {
  console.log(error);

});