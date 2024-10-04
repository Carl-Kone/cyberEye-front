import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit {

  private data = [
    { ip: '192.168.1.1', serviceCount: 5 },
    { ip: '192.168.1.2', serviceCount: 8 },
    { ip: '192.168.1.3', serviceCount: 3 },
    { ip: '10.0.0.1', serviceCount: 7 },
    { ip: '172.16.0.1', serviceCount: 2 }
  ];

  private svg: any;
  private margin = 50;
  private width = 400 - this.margin * 2;
  private height = 300 - this.margin * 2;

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.createSvg();
    this.drawBars();
  }

  private createSvg(): void {
    this.svg = d3.select(this.elRef.nativeElement).select("figure#bar")
      .append("svg")
      .attr("width", this.width + this.margin * 2)
      .attr("height", this.height + this.margin * 2)
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  private drawBars(): void {
    // Create the tooltip div and hide it initially
    const tooltip = d3.select("figure#bar")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #000")
      .style("padding", "5px")
      .style("pointer-events", "none");

    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(this.data.map(d => d.ip))
      .padding(0.2);

    // Draw the X-axis
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.serviceCount)!])  // Max number of services on Y-axis
      .range([this.height, 0]);

    // Draw the Y-axis
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.ip))
      .attr("y", (d: any) => y(d.serviceCount))
      .attr("width", x.bandwidth())
      .attr("height", (d: any) => this.height - y(d.serviceCount))
      .attr("fill", "#f6de06")
      .on("mouseover", (event: { pageX: number; pageY: number; currentTarget: any }, d: { data: { serviceCount: number; }; }) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(d.data.serviceCount + "")
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY) - 200 + "px")
          .style("background-color", "rgba(255, 255, 255, 0.7)")
          .style("color", "#fff")
          .style("padding", "10px")
          .style("border-radius", "4px")
          .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.5)");
      })
      .on("mousemove", (event: { pageX: number; pageY: number; }, d: { ip: string; serviceCount: string; }) => {
        tooltip
          .html("IP: " + d.ip + "<br>" + "Services: " + d.serviceCount)
          .style("left", (event.pageX) + "px")  // Position tooltip next to the mouse cursor
          .style("top", (event.pageY) - 200 + "px");
      })
      .on("mouseleave", () => {
        tooltip.style("opacity", 0);
      });
  }
}
