import { Component, OnInit, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-all-expired',
  standalone: true,
  imports: [],
  templateUrl: './all-expired.component.html',
  styleUrl: './all-expired.component.scss'
})
export class AllExpiredComponent implements OnInit {
  
  private data = [
    { axis: 'Domain', expired: 5, outOfScope: 2 },
    { axis: 'FQDN', expired: 8, outOfScope: 3 },
    { axis: 'IP', expired: 6, outOfScope: 1 },
    { axis: 'Service', expired: 4, outOfScope: 2 },
    { axis: 'Techno', expired: 7, outOfScope: 4 }
  ];

  private svg: any;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };
  private width = 300;
  private height = 297;
  private maxValue = 10;  // Maximum value across the data (you can dynamically calculate this)

  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
    this.createSvg();
    this.drawRadarChart();
  }

  private createSvg(): void {
    this.svg = d3.select(this.elRef.nativeElement).select("figure#radar")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + (this.width / 2 + this.margin.left) + "," + (this.height / 2 + this.margin.top) + ")");
  }

  private drawRadarChart(): void {
    const allAxis = this.data.map(d => d.axis); // Axis labels (e.g., Domain, FQDN, etc.)
    const total = allAxis.length;  // Number of axes
    const angleSlice = Math.PI * 2 / total;  // Angle for each axis
    const radius = Math.min(this.width / 2, this.height / 2);  // Radius of the radar chart

    // Scale for the radius
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, this.maxValue]);

    // Create the radial lines for each axis
    this.svg.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d: any, i: number) => rScale(this.maxValue * 1.1) * Math.sin(i * angleSlice))
      .attr("y2", (d: any, i: number) => rScale(this.maxValue * 1.1) * Math.cos(i * angleSlice))
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

    // Add labels for each axis
    this.svg.selectAll(".axisLabel")
      .data(allAxis)
      .enter()
      .append("text")
      .attr("x", (d: any, i: number) => rScale(this.maxValue * 1.2) * Math.sin(i * angleSlice))
      .attr("y", (d: any, i: number) => rScale(this.maxValue * 1.2) * Math.cos(i * angleSlice))
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .style("fill", "white")
      .text((d: any) => d);

    // Map the data for the radar areas
    const radarLine = d3.lineRadial()
      .radius((d: any) => rScale(d.value))
      .angle((d: any, i) => i * angleSlice);

    const dataRadar = [
      this.data.map((d) => ({ axis: d.axis, value: d.expired })),
      this.data.map((d) => ({ axis: d.axis, value: d.outOfScope }))
    ];

    // Draw the radar areas for expired, out-of-scope, and in-scope
    const radarColors = ['#c45c5c', '#5b93c2'];  // Colors for each dataset
    dataRadar.forEach((dataset, idx) => {
      this.svg.append('path')
        .datum(dataset)
        .attr('d', radarLine)
        .style('stroke', radarColors[idx])
        .style('fill', radarColors[idx])
        .style('fill-opacity', 0.5)
        .style('stroke-width', 2);
    });
  }
}
