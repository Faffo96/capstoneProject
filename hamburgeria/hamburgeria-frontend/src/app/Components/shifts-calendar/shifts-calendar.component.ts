import { Component, OnInit } from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { ShiftService } from '../../Services/shift.service';
import { EmployeeService } from '../../Services/employee.service';
import { ShiftDTO } from '../../models/shift-dto';
import { PagedResponse } from '../../models/paged-response';
import { TimePipe } from '../../pipes/time.pipe';
import { isSameDay, isSameMonth } from 'date-fns';
import { EmployeeResponseDTO } from '../../models/employee-response-dto';

const employeeColorMap: { [key: string]: { primary: string, secondary: string } } = {
  'customer@example.com': { primary: '#FFB6C1', secondary: '#FFE4E1' },
  'employee2@example.com': { primary: '#FFD700', secondary: '#FFF8DC' },
  'employee3@example.com': { primary: '#87CEEB', secondary: '#E0FFFF' },
  'employee4@example.com': { primary: '#FF69B4', secondary: '#FFB6C1' },
  'employee5@example.com': { primary: '#BA55D3', secondary: '#E6E6FA' },
  'employee6@example.com': { primary: '#FF6347', secondary: '#FFDAB9' },
  'employee7@example.com': { primary: '#4682B4', secondary: '#B0E0E6' },
  'employee8@example.com': { primary: '#32CD32', secondary: '#98FB98' },
  'employee9@example.com': { primary: '#FFA07A', secondary: '#FFE4B5' },
  'employee10@example.com': { primary: '#20B2AA', secondary: '#AFEEEE' },
};

type WeekDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

@Component({
  selector: 'app-shifts-calendar',
  templateUrl: './shifts-calendar.component.html',
  styleUrls: ['./shifts-calendar.component.scss'],
  providers: [DatePipe, TimePipe]
})
export class ShiftsCalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  monthName: string = '';
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;
  employees: EmployeeResponseDTO[] = [];

  newShift = {
    employeeEmail: '',
    startDate: '',
    endDate: '',
    repeatDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    } as { [key in WeekDays]: boolean }
  };

  constructor(
    private datePipe: DatePipe,
    private shiftService: ShiftService,
    private employeeService: EmployeeService,
    private timePipe: TimePipe
  ) {
    this.monthName = this.datePipe.transform(this.viewDate, 'MMMM yyyy')!;
  }

  ngOnInit(): void {
    this.updateMonthName();
    this.loadShifts();
    this.loadEmployees();
  }

  loadShifts(): void {
    this.shiftService.getShifts().subscribe((data: ShiftDTO[]) => {
      this.events = data.map(shift => ({
        start: new Date(shift.startDate),
        end: new Date(shift.endDate),
        title: `${shift.employee.name}: ${this.timePipe.transform(shift.startDate)} - ${this.timePipe.transform(shift.endDate)}`,
        color: this.getEmployeeColor(shift.employee.email),
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        draggable: true,
      }));
    });
  }
  

  loadEmployees(): void {
    this.employeeService.getAllEmployeesUnpaged().subscribe((data: EmployeeResponseDTO[]) => {
      this.employees = data;
    });
  }

  createShifts(): void {
    const { employeeEmail, startDate, endDate, repeatDays } = this.newShift;
    const employee = this.employees.find(e => e.email === employeeEmail);
    if (!employee) {
      console.error('Employee not found');
      return;
    }
    const shiftsToCreate: ShiftDTO[] = [];

    (Object.keys(repeatDays) as WeekDays[]).forEach(day => {
      if (repeatDays[day]) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let current = new Date(start);
        while (current.getMonth() === start.getMonth()) {
          if (current.getDay() === this.getDayNumber(day)) {
            shiftsToCreate.push({
              employee,
              startDate: this.convertToISOString(new Date(current)),
              endDate: this.convertToISOString(new Date(current.getFullYear(), current.getMonth(), current.getDate(), end.getHours(), end.getMinutes())),
            });
          }
          current.setDate(current.getDate() + 1);
        }
      }
    });

    if (!(Object.values(repeatDays) as boolean[]).some(day => day)) {
      shiftsToCreate.push({
        employee,
        startDate: this.convertToISOString(new Date(startDate)),
        endDate: this.convertToISOString(new Date(endDate))
      });
    }

    shiftsToCreate.forEach(shift => {
      this.shiftService.createShift(shift).subscribe(() => {
        this.loadShifts();
      });
    });

    this.newShift = { 
      employeeEmail: '', 
      startDate: '', 
      endDate: '', 
      repeatDays: { 
        monday: false, 
        tuesday: false, 
        wednesday: false, 
        thursday: false, 
        friday: false, 
        saturday: false, 
        sunday: false 
      } 
    };

    console.log("shifts:", this.loadShifts());
  }

  convertToISOString(date: Date): string {
    return date.toISOString();
  }

  getEmployeeColor(email: string): { primary: string, secondary: string } {
    return employeeColorMap[email] || { primary: '#ad2121', secondary: '#FAE3E3' }; // Colore di default
  }

  getDayNumber(day: WeekDays): number {
    const days: { [key in WeekDays]: number } = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    };
    return days[day];
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
      this.updateMonthName();
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.updateMonthName();
  }

  setView(view: CalendarView) {
    this.view = view;
    this.updateMonthName();
  }

  updateMonthName(): void {
    this.monthName = this.datePipe.transform(this.viewDate, 'MMMM yyyy')!;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
