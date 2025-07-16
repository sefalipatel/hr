import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions } from '@fullcalendar/core';

import { CommonService } from 'src/app/service/common/common.service';

@Component({
  selector: 'app-birthday-calendar',
  standalone: true,
  imports: [CommonModule, SharedModule, FullCalendarModule],
  templateUrl: './birthday-calendar.component.html',
  styleUrls: ['./birthday-calendar.component.scss']
})
export class BirthdayCalendarComponent implements OnInit {

  options: any = {};
  calendarOption: CalendarOptions;

  constructor(private _commonService: CommonService) {

  }

  ngOnInit(): void {
   
    this.getBirthdays();

    this.calendarOption = {
      ...this.options,
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    };
  }

  getBirthdays() {
    this._commonService.get(`Person/birthdays`).subscribe((res: any) => {
    
        const currentYear = new Date().getFullYear();

        const birthdayEvents = [];
    
        res?.value?.forEach((monthData: any) => {
          monthData.birthdays.forEach((person: any) => {
            const birthDate = new Date(person.birthDate);
            const eventDate = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
            birthdayEvents.push({
              title: person.name,
              start: eventDate.toISOString().split('T00:00:00')[0], // Format YYYY-MM-DD
              allDay: true,
              backgroundColor: 'DodgerBlue',
              borderColor: 'white'
            });
          });
        });
    
        this.options = {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
          initialView: 'dayGridMonth', 
          headerToolbar: {
            left: 'prev,next today',
            right: 'title',
          },
          eventColor: 'purple',
          events: birthdayEvents,
          eventContent: function (arg: any) {
            return {
              html: `
               <div class="p-1 border-rounded" style="display: flex; align-items: center; font-weight: bold; font-size: 14px;">
                <img src="assets/images/dashboard-2/d-6-3.png" style="width: 14px; margin-right: 5px;" />
                <span style="white-space: nowrap;">${arg.event.title}</span>
              </div>
              `
            };
          }
        }

        this.calendarOption = {
          ...this.options,
          initialView: 'dayGridMonth',
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        };
    });
  }
  
}
