import { Component } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pie-chart',
  imports: [NgxEchartsModule],
  templateUrl: './pie-chart.html',
  styleUrl: './pie-chart.scss',
})
export class PieChart {
  chartOptions = {} as any;

  constructor(private translate: TranslateService) {
    this.chartOptions = this.buildOptions();
    this.translate.onLangChange.subscribe(() => {
      this.chartOptions = this.buildOptions();
    });
  }

  private buildOptions(): any {
    const seriesName = this.translate.instant('fees.title');
    const fixedFees = this.translate.instant('fees.addFee.fixed') + ' ' + this.translate.instant('fees.title');
    const percentageFees = this.translate.instant('fees.addFee.percentage') + ' ' + this.translate.instant('fees.title');

    return {
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
          name: seriesName,
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
            { value: 1048, name: fixedFees },
            { value: 735, name: percentageFees },
          ],
        },
      ],
    };
  }
}
