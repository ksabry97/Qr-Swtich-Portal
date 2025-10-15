import { Component } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-line-chart',
  imports: [NgxEchartsModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart {
  chartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow', // highlights the bar when hovered
      },
      formatter: (params: any) => {
        let tooltip = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach((item: any) => {
          tooltip += `${item.marker} ${item.seriesName}: <b>${item.value}</b><br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      top: '5%', // position of legend (you can use 'bottom', 'left', 'right' too)
      textStyle: {
        color: '#333', // optional, customize text color
        fontSize: 14,
      },
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Pending Tenants', // this name appears in the legend
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: 'Approved Tenants',
        data: [100, 180, 130, 60, 50, 90, 120],
        type: 'bar',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  };
}
