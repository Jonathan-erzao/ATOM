import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  ngOnInit(): void {
    this.renderChart();
  }

  async renderChart(): Promise<void> {
    const response = await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v10.3.3/samples/data/usdeur.json');
    const data = await response.json();

    const options: Options = {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Ganancias en USD por meses',
        align: 'left'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Radio de ganancias'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: '#7cb5ec',
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: [{
        type: 'area',
        name: 'USD',
        data: data.map((point: any) => [point[0], point[1]])
      }]
    };

    Highcharts.chart('container', options);
  }
}
