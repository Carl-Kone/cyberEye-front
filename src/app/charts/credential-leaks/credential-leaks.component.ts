import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-credential-leaks',
  standalone: true,
  imports: [],
  templateUrl: './credential-leaks.component.html',
  styleUrl: './credential-leaks.component.scss'
})
export class CredentialLeaksComponent implements OnInit {

  private data = [
    { date: new Date('2023-01-01'), emailLeak: 0, passwordLeak: 0 },
    { date: new Date('2023-01-02'), emailLeak: 1, passwordLeak: 0 },
    { date: new Date('2023-01-03'), emailLeak: 0, passwordLeak: 0 },
    { date: new Date('2023-01-04'), emailLeak: 1, passwordLeak: 1 },
    { date: new Date('2023-01-05'), emailLeak: 0, passwordLeak: 0 },
    { date: new Date('2023-01-06'), emailLeak: 0, passwordLeak: 0 },
  ];

  private svg: any;
  private margin = { top: 50, right: 30, bottom: 50, left: 60 };
  private width = 400 - this.margin.left - this.margin.right;
  private height = 350 - this.margin.top - this.margin.bottom;

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.createSvg();
    this.drawScatterPlot();
  }

  private createSvg(): void {
    this.svg = d3.select(this.elRef.nativeElement).select("figure#scatter")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom + 15)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
  }

  private drawScatterPlot(): void {
    // Create tooltip div, initially hidden
    const tooltip = d3.select("figure#scatter")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #000")
      .style("padding", "5px")
      .style("pointer-events", "none");

    // Create scales for the x and y axis
    const x = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.date) as [Date, Date])  // Extent gives the min and max values
      .range([0, this.width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.emailLeak + d.passwordLeak)!])  // Max number of leaks on the Y-axis
      .range([this.height, 0]);

    // Define the radius of the circles based on the number of leaks
    const rScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.emailLeak + d.passwordLeak)!])
      .range([0, 20]);  // Minimum and maximum circle size

    // Add circles for each data point (scatter plot)
    this.svg.selectAll("circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("cx", (d: { date: Date | d3.NumberValue; }) => x(d.date))
      .attr("cy", (d: {
        emailLeak: d3.NumberValue;
        passwordLeak: d3.NumberValue; 
      }) => y(+d.emailLeak + +d.passwordLeak))
      .attr("r", (d: {
        emailLeak: d3.NumberValue;
        passwordLeak: d3.NumberValue; 
      }) => rScale(+d.emailLeak + +d.passwordLeak))  // Use the number of leaks to size the circles
      .attr("fill", "#5b93c2")
      .attr("stroke", "#fff")
      .attr("stroke-width", .5)
      .style("opacity", 0.7)
      .on("mouseover", (event: { pageX: number; pageY: number; }, d: { emailLeak: number; passwordLeak: number }) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`Email leaks: ${d.emailLeak} <br> Password leaks: ${d.passwordLeak}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY) - 200 + "px")
          .style("background-color", "rgba(255, 255, 255, 0.7)")
          .style("color", "#000")
          .style("padding", "10px")
          .style("border-radius", "4px")
          .style("box-shadow", "0 0 10px rgba(0, 0, 0, 0.5)");
      })
      .on("mousemove", (event: { pageX: number; pageY: number; }, d: { emailLeak: number; passwordLeak: number }) => {
        tooltip.html(`Email leaks: ${d.emailLeak} <br> Password leaks: ${d.passwordLeak}`)
          .style("left", (event.pageX + 100) + "px")
          .style("top", (event.pageY + 100) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition()
          .duration(500)
          //.style("opacity", 0);
      });

    // Add the X-axis (Dates)
    this.svg.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat((domainValue, index) => {
        if (domainValue instanceof Date) {
          return d3.timeFormat('%Y-%m-%d')(domainValue);
        }
        return domainValue.toString();
      }))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add the Y-axis (Number of leaks)
    this.svg.append("g")
      .call(d3.axisLeft(y).ticks(5));

    // Add labels and titles (optional)
    /*this.svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", this.height + this.margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Date");

    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.height / 2)
      .attr("y", -this.margin.left + 10)
      .attr("text-anchor", "middle")
      .text("Number of Leaks");*/
  }
}
