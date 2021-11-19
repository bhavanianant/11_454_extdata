const height = 800;
const width = 600;
const margin = {left: 300, right: 30, top: 30, bottom: 30};

const barHeight= 15;
const gap = 5;
const barWidthMultiplier = .01;

const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("width",width + margin.left)
    .attr("height",height + margin.top)
    .attr("transform","translate(0,30)");
    // .attr("viewBox",[0,0,width,height]);

function plotBarChart(dataset) {
			const sorted_d = dataset.sort((a,b) => a.total_count - b.total_count);		
			const xValues = sorted_d.map(d => d.total_count);
			// console.log(xValues);
			const xScale = d3.scaleLinear()
							.domain([0,d3.max(xValues)])
							.range([0,width]);
			const xAxis = d3.axisTop(xScale)
							.ticks(6);
			// console.log(xScale);
			const yValues = sorted_d.map(d => d.Name);
			const yScale = d3.scaleBand()
							.domain(yValues)
							.range([height,0])
							.paddingInner([0.15])
			const yAxis = d3.axisLeft(yScale);
            // rectangle bars
            svg.append("g")
                    .attr("class", "bars")
                .selectAll("rect")
                .data(dataset)
                .enter()
                .append("rect")
                    // .attr("y", (d, i) => i * (barHeight + gap) + margin.top)
                    .attr("y",(d,i) => yScale(d.Name) + margin.top)
                    .attr("x", margin.left)
                    .attr("height", yScale.bandwidth())
                    .attr("width", d => xScale(d.total_count))
                    .attr("fill", "teal")
                  	.on("mouseover", function(event,d) {
								d3.select("#tooltip")
									.style("left", event.pageX + "px")
									.style("top", event.pageY + "px")
									.select("#value")
									.html("<p>" + String(d.total_count) +"</p>");
								d3.select("#tooltip")
									.classed("hidden", false);
								})
					.on("mouseout", function() {
								d3.select("#tooltip")
									.classed("hidden", true);
								});
            // text on y-axis

            // svg.append("g")
            //         .attr("class", "labels")
            //     .selectAll("text")
            //     .data(dataset)
            //     .enter()
            //     .append("text")
            //         .attr("y", (d, i) => i * (barHeight + gap) + barHeight/2 + margin.top + 2)
            //         .attr("x", margin.left - gap)
            //         .attr("text-anchor", "end")
            //         .attr("font-size", "0.6em")
            //         .attr("fill", "black")
            //         .text(d => d.Name);
            svg.append("g")
            	.attr("class","xaxis-styling")
            	.attr("transform","translate(301,29)")
            	.call(xAxis);
            svg.append("g")
            	.attr("class","yaxis-styling hidden")
            	.attr("transform","translate(301,29)")
            	.call(yAxis);
        };

d3.csv("./boston_311.csv", d3.autoType)
            .then(function(data) {
                // console.log(data);
                // sorted
                plotBarChart(data);
            })