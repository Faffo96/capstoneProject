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
  @ViewChild('productChart', { static: true }) productChartElement!: ElementRef;
  @ViewChild('reservationChart', { static: true }) reservationChartElement!: ElementRef;

  public selectedYear: number = new Date().getFullYear();
  public selectedMonth: number = new Date().getMonth() + 1;
  public selectedProductYear: number = new Date().getFullYear();
  public selectedProductMonth: number = new Date().getMonth() + 1;
  public selectedReservationYear: number = new Date().getFullYear();
  public selectedReservationMonth: number = new Date().getMonth() + 1;
  public selectedReservationDay: number = new Date().getDate();
  public revenueType: string = 'monthly';
  public productRevenueType: string = 'monthly';
  public reservationCountType: string = 'monthly';
  public barChart: Chart | undefined;
  public productBarChart: Chart | undefined;
  public reservationBarChart: Chart | undefined;
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
  public productBarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Quantità Prodotti Venduti',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  public reservationBarChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Numero Prenotazioni',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  public chartDataList: ChartDataItem[] = [];
  public productChartDataList: ChartDataItem[] = [];
  public reservationChartDataList: ChartDataItem[] = [];
  public months: string[] = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  public days: number[] = Array.from({length: 31}, (_, i) => i + 1);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updateChartData();
    this.updateProductChartData();
    this.updateReservationChartData();
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

  fetchProductSalesData(year: number, month?: number): void {
    const url = this.productRevenueType === 'monthly'
      ? `http://localhost:8080/api/carts/product-quantities?year=${year}&month=${month}`
      : `http://localhost:8080/api/carts/product-quantities?year=${year}`;
    
    this.http.get<{[key: string]: number}>(url).subscribe(data => {
      const labels = Object.keys(data);
      const values = Object.values(data);

      this.productBarChartData.labels = labels;
      this.productBarChartData.datasets[0].data = values;

      this.updateProductChart();
      this.updateProductChartDataList(labels, values);
    });
  }

  fetchReservationCountData(year: number, month?: number, day?: number): void {
    let url = '';
    if (this.reservationCountType === 'monthly') {
      url = `http://localhost:8080/api/reservations/count/monthly?year=${year}`;
    } else if (this.reservationCountType === 'daily') {
      url = `http://localhost:8080/api/reservations/count/daily?year=${year}&month=${month}`;
    } else {
      url = `http://localhost:8080/api/reservations/count/hourly?year=${year}&month=${month}&day=${day}`;
    }

    this.http.get<{[key: string]: number}>(url).subscribe(data => {
      const labels = Object.keys(data);
      const values = Object.values(data);

      this.reservationBarChartData.labels = labels;
      this.reservationBarChartData.datasets[0].data = values;

      this.updateReservationChart();
      this.updateReservationChartDataList(labels, values);
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

  updateProductChart(): void {
    if (this.productBarChart) {
      this.productBarChart.data.labels = this.productBarChartData.labels;
      this.productBarChart.data.datasets = this.productBarChartData.datasets;
      this.productBarChart.update();
    } else {
      const ctx = this.productChartElement.nativeElement.getContext('2d');
      this.productBarChart = new Chart(ctx, {
        type: 'bar',
        data: this.productBarChartData,
        options: this.barChartOptions
      });
    }
  }

  updateReservationChart(): void {
    if (this.reservationBarChart) {
      this.reservationBarChart.data.labels = this.reservationBarChartData.labels;
      this.reservationBarChart.data.datasets = this.reservationBarChartData.datasets;
      this.reservationBarChart.update();
    } else {
      const ctx = this.reservationChartElement.nativeElement.getContext('2d');
      this.reservationBarChart = new Chart(ctx, {
        type: 'bar',
        data: this.reservationBarChartData,
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

  updateProductChartDataList(labels: string[], values: number[]): void {
    this.productChartDataList = labels.map((label, index) => ({
      label: label,
      value: values[index]
    }));
  }

  updateReservationChartDataList(labels: string[], values: number[]): void {
    this.reservationChartDataList = labels.map((label, index) => ({
      label: label,
      value: values[index]
    }));
  }

  changeYear(delta: number): void {
    this.selectedYear += delta;
    this.updateChartData();
  }

  changeProductYear(delta: number): void {
    this.selectedProductYear += delta;
    this.updateProductChartData();
  }

  changeReservationYear(delta: number): void {
    this.selectedReservationYear += delta;
    this.updateReservationChartData();
  }

  updateChartData(): void {
    if (this.revenueType === 'monthly') {
      this.fetchRevenueData(this.selectedYear);
    } else {
      this.fetchRevenueData(this.selectedYear, this.selectedMonth);
    }
  }

  updateProductChartData(): void {
    if (this.productRevenueType === 'monthly') {
      this.fetchProductSalesData(this.selectedProductYear, this.selectedProductMonth);
    } else {
      this.fetchProductSalesData(this.selectedProductYear);
    }
  }

  updateReservationChartData(): void {
    if (this.reservationCountType === 'monthly') {
      this.fetchReservationCountData(this.selectedReservationYear);
    } else if (this.reservationCountType === 'daily') {
      this.fetchReservationCountData(this.selectedReservationYear, this.selectedReservationMonth);
    } else {
      this.fetchReservationCountData(this.selectedReservationYear, this.selectedReservationMonth, this.selectedReservationDay);
    }
  }
}