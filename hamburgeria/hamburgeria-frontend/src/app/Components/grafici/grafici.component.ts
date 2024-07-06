import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js/auto';
import { Chart } from 'chart.js/auto';

interface ChartDataItem {
  label: string;
  value: number;
}

@Component({
  selector: 'app-grafici',
  templateUrl: './grafici.component.html',
  styleUrl: './grafici.component.scss'
})
export class GraficiComponent implements OnInit {
  @ViewChild('chart1', { static: true }) chartElement!: ElementRef;

  public selectedYear: number = new Date().getFullYear();
  public selectedMonth: number = new Date().getMonth() + 1;
  public revenueType: string = 'monthly';
  public barChart: Chart | undefined;
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Incassi Mensili',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  public chartDataList: ChartDataItem[] = [];
  public months: string[] = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updateChartData();
  }

  fetchRevenueData(year: number, month?: number): void {
    const url = this.revenueType === 'monthly' 
      ? `http://localhost:8080/api/carts/revenue/monthly?year=${year}`
      : `http://localhost:8080/api/carts/revenue/daily?year=${year}&month=${month}`;
    
    this.http.get<{[key: string]: number}>(url).subscribe(data => {
      const labels = Object.keys(data);
      const values = Object.values(data);

      this.barChartData.labels = labels;
      this.barChartData.datasets[0].data = values;

      this.updateChart();
      this.updateChartDataList(labels, values);
    });
  }

  updateChart(): void {
    if (this.barChart) {
      this.barChart.data.labels = this.barChartData.labels;
      this.barChart.data.datasets = this.barChartData.datasets;
      this.barChart.update();
    } else {
      const ctx = this.chartElement.nativeElement.getContext('2d');
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: this.barChartData,
        options: this.barChartOptions
      });
    }
  }

  updateChartDataList(labels: string[], values: number[]): void {
    this.chartDataList = labels.map((label, index) => ({
      label: label,
      value: values[index]
    }));
  }

  changeYear(delta: number): void {
    this.selectedYear += delta;
    this.updateChartData();
  }

  updateChartData(): void {
    if (this.revenueType === 'monthly') {
      this.fetchRevenueData(this.selectedYear);
    } else {
      this.fetchRevenueData(this.selectedYear, this.selectedMonth);
    }
  }
}