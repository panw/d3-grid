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

Grid.prototype.toString = function(target, neighbors) {
  console.log("Node #"+target.id, "{ x:", target.x, "y: ", target.y + "}");
  console.log("Neighbors:");
  neighbors.forEach(function(neighbor) {
    console.log("- Node #"+neighbor, "{ x:", this.nodes[neighbor].x, "y: ", this.nodes[neighbor].y + "}");
  }.bind(this));
  console.log("");
}

Grid.prototype.cordToIndex = function(row, col) {
  var index = this.numCols * row + col;
  if(row < this.numRows && col < this.numCols && 
      row > -1 && col > -1 && index < this.nodes.length)
    return index;
  return null;
}

Grid.prototype.highlightNeighbors = function(node) {
  var nodeRow = Math.floor(node.id / this.numCols),
      nodeCol = node.id % this.numCols,
      neighbors = [],
      horizontalNeigbhors = [nodeCol - 1, nodeCol + 1],
      verticalNeighbors = [nodeRow - 1, nodeRow + 1];
  neighbors = neighbors.concat(horizontalNeigbhors.map(function(neighborCol) {
    return this.cordToIndex(nodeRow, neighborCol);
  }.bind(this)));

  neighbors = neighbors.concat(verticalNeighbors.map(function(neighborRow) {
    return this.cordToIndex(neighborRow, nodeCol);
  }.bind(this)));

  neighbors = neighbors.filter(Boolean)
    .sort(function(a, b) { return a - b; });
  
  neighbors.forEach(function(neighbor) {
    if(d3.event.type == "mouseover") {
      d3.select("#rect-" + node.id).style("opacity", 0.5);
      d3.select("#rect-" + neighbor).style("opacity", 0.5);
      this.toString(node, neighbors);
    } else {
      d3.select("#rect-" + node.id).style("opacity", 1);
      d3.select("#rect-" + neighbor).style("opacity", 1);
    }
  }.bind(this));
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
    .style("opacity", 1e-6)
    .on("mouseover", this.highlightNeighbors.bind(this))
    .on("mouseout", this.highlightNeighbors.bind(this));
  rect.transition()
    .attr("width", this.grid.nodeSize()[0])
    .attr("height", this.grid.nodeSize()[1])
    .attr("transform", function(d) { return "translate(" + (d.x + 360)+ "," + d.y + ")"; })
    .style("opacity", 1);
  rect.exit().transition()
    .style("opacity", 1e-6)
    .remove(); 
}