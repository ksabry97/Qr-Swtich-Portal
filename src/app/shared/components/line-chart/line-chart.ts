import { Component, OnDestroy } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  imports: [NgxEchartsModule],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss',
})
export class LineChart implements OnDestroy {
  chartOptions = {} as any;
  private languageChangeSubscription: Subscription;

  constructor(private translate: TranslateService) {
    this.chartOptions = this.buildOptions();
    this.languageChangeSubscription = this.translate.onLangChange.subscribe(() => {
      this.chartOptions = this.buildOptions();
    });
  }

  ngOnDestroy(): void {
    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }

  private buildOptions(): any {
    const days = [
      this.translate.instant('common.days.mon'),
      this.translate.instant('common.days.tue'),
      this.translate.instant('common.days.wed'),
      this.translate.instant('common.days.thu'),
      this.translate.instant('common.days.fri'),
      this.translate.instant('common.days.sat'),
      this.translate.instant('common.days.sun'),
    ];

    const pendingLabel = this.translate.instant('dashboard.charts.pendingTenants');
    const approvedLabel = this.translate.instant('dashboard.charts.approvedTenants');

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
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
        top: '5%',
        textStyle: {
          color: '#333',
          fontSize: 14,
        },
      },
      xAxis: {
        type: 'category',
        data: days,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: pendingLabel,
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
          },
        },
        {
          name: approvedLabel,
          data: [100, 180, 130, 60, 50, 90, 120],
          type: 'bar',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
          },
        },
      ],
    };
  }
}
