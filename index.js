fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    response.json().then((data) => {
      const dataset = data;
      console.log(dataset);

      const minYear = d3.min(dataset, (d) => d.Year);
      const maxYear = d3.max(dataset, (d) => d.Year);

      // parse time on each entry so it can be handled by yScale()
      let parsedTime;

      data.forEach((d) => {
        parsedTime = d.Time.split(":");
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });

      const margin = {
        top: 100,
        right: 20,
        bottom: 30,
        left: 60,
      };
      let svgWidth = 1000 - margin.left - margin.right;
      let svgHeight = 700 - margin.top - margin.bottom;

      const padding = 50;

      const xScale = d3
        .scaleLinear()
        .domain([minYear, maxYear])
        .range([padding, svgWidth - padding]); // add padding later

      const yScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, (d) => d.Time)) //input // ["36.50", "39.50"]
        .range([padding, svgHeight]); //output

      // tooltip
      const tooltip = d3
        .select(".visHolder")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

      const svg = d3
        .select("body")
        .append("svg")
        .attr("width", svgWidth + margin.left + margin.right)
        .attr("height", svgHeight + margin.top + margin.bottom)
        .attr("class", "svg-element")
        .style("padding", padding);

      svg
        .selectAll()
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", (d) => xScale(d.Year))
        .attr("data-xvalue", (d) => d.Year)
        .attr("cy", (d) => yScale(d.Time))
        .attr("data-yvalue", (d) => d.Time.toISOString())
        .attr("fill", (d) => (d.Doping !== "" ? "red" : "blue"))
        .on("mouseover", (d, i) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(
              `Name: ${d.Name}, Nationality: ${d.Nationality}, Place: ${
                d.Place
              }, Seconds: ${d.Seconds}. ${
                d.Doping !== "" ? "Doping: " + d.Doping : ""
              }`
            )
            .attr("data-year", d.Year);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(200).style("opacity", 0);
        });

      // create x-axis
      const yearFormat = d3.format("d");
      const xAxis = d3.axisBottom(xScale).tickFormat(yearFormat);

      // create y-axis
      const timeFormat = d3.timeFormat("%M:%S");
      const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, ${0})`)
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Best Time (minutes)");

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${0}, ${svgHeight})`)
        .call(xAxis)
        .call(xAxis)
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", svgWidth)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Year");

      // legend
      //   svg.append("legend").attr("id", "legend").text("descriptive text");

      var legendContainer = svg.append("g").attr("id", "legend");

      let legendData = [
        ["doping allegations", "red"],
        ["clean", "blue"],
      ];

      var legend = legendContainer
        .selectAll("#legend")
        .data(legendData)
        .enter()
        .append("legend")
        .attr("class", "legend-label")
        .attr("transform", (d, i) => {
          return "translate(0," + (svgHeight / 2 - i * 20) + ")";
        });

      legend
        .append("rect")
        .attr("x", svgWidth - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d) => d[1]);

      legend
        .append("text")
        .attr("x", svgWidth - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text((d) => d[0]);
    });
  })
  .catch((err) => {
    console.log("Fetch Error :-S", err);
  });
