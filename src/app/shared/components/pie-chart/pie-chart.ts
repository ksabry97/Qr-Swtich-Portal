import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'app-pie-chart',
  imports: [NgxEchartsModule],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.scss',
})
export class PieChart {
  chartOptions = {
    width: '100%',
    height: '100%',
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        name: 'Fees',
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: true,
          position: 'center',
          fontSize: 24,
          fontWeight: 'bold',
          formatter: function (params: any) {
            // params.seriesName gives you 'Bills'
            return params.seriesName;
          },
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: 'Fixed Fees' },
          { value: 735, name: 'Percentage Fees' },
        ],
      },
    ],
  };
}
