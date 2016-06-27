function Grid(w, h, n) {
  this.width = w;
  this.height = h;
  this.numCols = Math.ceil(Math.sqrt(n));
  this.numRows = Math.ceil(n / this.numCols);
  this.grid = d3.layout.grid()
    .bands()
    .size([360, 360])
    .padding([0.1, 0.1]);
  this.nodes = this.grid(Array.apply(null, Array(n)).map(function(node, i) { return {id: i} }));
}

Grid.prototype.render = function() {
  var svg = d3.select("body").append("svg")
    .attr({
      width: this.width,
      height: this.height
    })
    .append("g")
  var rect = svg.selectAll(".rect")
    .data(this.nodes);
  rect.enter().append("rect")
    .attr("class", "rect")
    .attr("id", function(data) { return "rect-" + data.id })
    .attr("width", this.grid.nodeSize()[0])
    .attr("height", this.grid.nodeSize()[1])
    .attr("transform", function(d) { return "translate(" + (d.x + 360)+ "," + d.y + ")"; })
    .style("opacity", 1e-6);
  rect.transition()
    .attr("width", this.grid.nodeSize()[0])
    .attr("height", this.grid.nodeSize()[1])
    .attr("transform", function(d) { return "translate(" + (d.x + 360)+ "," + d.y + ")"; })
    .style("opacity", 1);
  rect.exit().transition()
    .style("opacity", 1e-6)
    .remove(); 
}