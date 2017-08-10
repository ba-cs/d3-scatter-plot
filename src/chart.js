const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40,
};

const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const x = d3.scaleTime()
  .range([0, width - 200]);

const y = d3.scaleLinear()
  .range([height, 0]);

const container = d3.select('body').append('div')
  .attr('class', 'container');

container.append('h1')
  .text('Doping in Professional Cycling');

container.append('h4')
  .text("35 Fastest times up Alpe d'Huez");

const svg = container.append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left + 50}, ${margin.top})`);

fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then((data) => {
    const timeMinSec = (seconds) => {
      const date = new Date(null);
      date.setSeconds(seconds);
      return date;
    };

    const time = data.map(d => d.Seconds);
    const minTime = d3.min(time);
    const maxTime = d3.max(time);

    const place = data.map(d => d.Place);
    const minPlace = d3.min(place);
    const maxPlace = d3.max(place);

    x.domain([timeMinSec((maxTime - minTime) + 15), timeMinSec(minTime - minTime)]);
    y.domain([maxPlace + 3, minPlace]);

    const tip =  d3.select('body')
      .append('div')
      .attr('class', 'tooltip');

    svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx', d => x(timeMinSec(d.Seconds - minTime)))
      .attr('cy', d => y(d.Place))
      .attr('r', 5)
      .attr('class', d => (d.Doping ? 'red' : 'blue'))
      .on('mousemove', (d) => {
        tip
          .style('position', 'absolute')
          .style('left', `${d3.event.pageX + 10}px`)
          .style('top', `${d3.event.pageY + 20}px`)
          .style('display', 'inline-block')
          .style('opacity', '0.9')
          .html(`
            <span>${d.Name}: ${d.Nationality}</span>
            <span>Year: ${d.Year}, Time: ${d.Time}</span>
            <br>
            <span>${d.Doping}</span>
          `);
      })
      .on('mouseout', () => tip.style('display', 'none'));

    svg.selectAll('text')
      .data(data)
      .enter().append('text')
      .text(d => d.Name)
      .attr('x', d => x(timeMinSec(d.Seconds - minTime)) + 15)
      .attr('y', d => y(d.Place) + 5);

    svg.append('circle')
      .attr('class', 'red')
      .attr('cx', '550')
      .attr('cy', '270')
      .attr('r', '5');

    svg.append('text')
      .attr('x', '560')
      .attr('y', '273')
      .text('Riders with doping allegations');

    svg.append('circle')
      .attr('class', 'blue')
      .attr('cx', '550')
      .attr('cy', '300')
      .attr('r', '5');

    svg.append('text')
      .attr('x', '560')
      .attr('y', '303')
      .text('No doping allegations');

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%M:%S')));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.append('text')
      .text('Ranking')
      .style('font-size', '18px')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (height / 2))
      .attr('y', 0 - margin.left);

    container.append('div')
      .style('transform', `translateX(${-25}px)`)
      .text('Minutes Behind Fastest Time');
  });
