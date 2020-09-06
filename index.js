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
        .attr("data-yvalue", (d) => d.Time.toISOString());

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
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Year");
    });
  })
  .catch((err) => {
    console.log("Fetch Error :-S", err);
  });
