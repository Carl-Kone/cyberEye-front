import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit {

  private data = [
    { status: 'Expired', count: 40 },
    { status: 'Active', count: 60 }
  ];

  private svg: any;
  private margin = 50;
  private width = 300;
  private height = 297;
  private radius = Math.min(this.width, this.height) / 2 - this.margin;

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.createSvg();
    this.createColors();
    this.drawChart();
  }

  private createSvg(): void {
    this.svg = d3.select(this.elRef.nativeElement).select("figure#pie")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }

  private createColors(): any {
    const color = d3.scaleOrdinal()
      .domain(this.data.map(d => d.status))
      .range(['#c45c5c', '#7cc35c']);  // Example color palette
    return color;
  }

  private drawChart(): void {
    const color = this.createColors();

    const pie = d3.pie<any>().value((d: any) => Number(d.count));

    const data_ready = pie(this.data);

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius);

    const arcHover = d3.arc()
      .innerRadius(0)
      .outerRadius(this.radius + 10); 

    const tooltip = d3.select("figure#pie")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #000")
      .style("padding", "5px")
      .style("pointer-events", "none");

    this.svg
      .selectAll('pieces')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d: any) => color(d.data.status))
      .attr("stroke", "#ffffff")
      .style("stroke-width", "2px")
      /*.on("mouseover", function(event: { pageX: number; pageY: number; currentTarget: any }, d: { data: { count: number; }; }) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(d.data.count + "%")
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 15) + "px")
          .style("background-color", "rgba(0, 0, 0, 0.7)")
          .style("color", "#fff")
          .style("padding", "10px")
          .style("border-radius", "4px")
          .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.5)");
      })
      .on("mousemove", function(event: { pageX: number; pageY: number; }) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 15) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })*/
      .on("mouseover", (event: { currentTarget: any; }, d: any) => {  // Arrow function here
        d3.select(event.currentTarget)   // Use event.currentTarget to select the element
          .transition()
          .duration(200)
          .attr('d', arcHover(d));
        this.svg.selectAll('text')
          .filter((textD: any) => textD.data.status === d.data.status) // Match the slice and text
          .transition()
          .duration(200)
          .style('font-size', '18px')
          .style('font-weight', 'bold')
          .style('text-shadow', '1px 1px 2px #363636'); 
      })
      .on("mouseout", (event: { currentTarget: any; }, d: any) => {   // Arrow function here
        d3.select(event.currentTarget)   // Use event.currentTarget to select the element
          .transition()
          .duration(200)
          .attr('d', arcGenerator(d));
        this.svg.selectAll('text')
          .filter((textD: any) => textD.data.status === d.data.status)
          .transition()
          .duration(200)
          .style('font-size', '12px')
          .style('font-weight', 'normal')
          .style('text-shadow', 'none');
      });

    // Add text labels to each slice
    this.svg
      .selectAll('pieces')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d: any) => `${d.data.status}: ${d.data.count}%`)
      .attr("transform", (d: any) => {
        const _d = arcGenerator.centroid(d);
        return `translate(${_d[0]}, ${_d[1]})`;
      })
      .style("text-anchor", "middle")
      .style("font-size", 12)
      .style("fill", "white");
  }

}
