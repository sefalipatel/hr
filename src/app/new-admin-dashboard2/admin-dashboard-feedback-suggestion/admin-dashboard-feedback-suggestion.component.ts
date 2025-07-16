import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SweetalertService } from 'src/app/demo/pages/role-list/sweetalert.service';
import { CommonService } from 'src/app/service/common/common.service';
import { environment } from 'src/environments/environment';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SlickCarouselModule } from 'ngx-slick-carousel'; 
import { TimeAgoPipe } from 'src/app/demo/pages/tickets/time-ago.pipe';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/theme/shared/shared.module';
declare const $: any;
@Component({
  selector: 'app-admin-dashboard-feedback-suggestion',
  standalone: true,
  imports: [CommonModule, SharedModule, TimeAgoPipe, SlickCarouselModule,  NgApexchartsModule,  MatButtonModule,
    MatTooltipModule,],
  templateUrl: './admin-dashboard-feedback-suggestion.component.html',
  styleUrls: ['./admin-dashboard-feedback-suggestion.component.scss']
})
export class AdminDashboardFeedbackSuggestionComponent {
  getALLFeedbackSuggestion:any;
  suggestions: any[] = [];
  feedbacks: any[] = [];

  public attachmentUrl: string = environment.apiUrl.replace('api/', '')
constructor(private commonservice: CommonService, private sweetlalert: SweetalertService, private router: Router) {
}
ngOnInit(): void {
 this.getAllFeedbackSuggestion()
}

onList() {
  this.router.navigate([`Admin-feedback`])
}
getAllFeedbackSuggestion() {
  this.commonservice.get(`AdminDashboard/FeedbackSuggestion`).subscribe((x) => {
    this.getALLFeedbackSuggestion = x.value
    
    this.suggestions = this.getALLFeedbackSuggestion
    .filter(item => item.suggestionType === 0)

  this.feedbacks = this.getALLFeedbackSuggestion
    .filter(item => item.suggestionType === 1)
    
    if (x) {
      setTimeout(() => {
        this.initializeSlickSlider();
      }, 0);
    }
  })
}
stringToColor(string: any) {
  let hash = 0;
  let i;
  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
    hash = string?.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */
  return string?.length ? color : '#bfbfbf';
}
transformImagePath(filePath: string): string {
  return this.attachmentUrl + filePath.replace('wwwroot\\', '');
}
generateInitials(name: string): string {
  if (!name) return '';
  // Split the name into two parts (like, ["Karan", "Tandel"])
  const nameParts = name.split(' ');
  // Take the first letter from each part and join them (like, "KT")
  const initials = nameParts.map(part => part.charAt(0)).join('');
  return initials.toUpperCase(); // Convert to uppercase (optional)
}
initializeSlickSlider(): void {
  setTimeout(() => {
    $('.feedback_slider').slick({
      infinite: true,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
      dots: false,
      vertical: true,
      slidesToShow: 3, // Set this to the number of slides you want to show at once
      cssEase: 'ease-out',
      touchMove: true,
      lazyLoad: 'ondemand', 
    });
  }, 500);
}

}
