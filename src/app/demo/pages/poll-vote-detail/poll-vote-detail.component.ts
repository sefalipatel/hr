import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CommonService } from 'src/app/service/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-poll-vote-detail',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './poll-vote-detail.component.html',
  styleUrls: ['./poll-vote-detail.component.scss']
})
export class PollVoteDetailComponent implements OnInit {
  public voterProfile: any;
  public pollId: any;
  public attachmentUrl: string = environment.apiUrl.replace('api/', '')
  public pollTitle: string;
  public voterChoice: any;

  constructor(private commonService: CommonService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.pollId = this.pollId ?? params['id'];
    })
    this.getVoteData();
  }

  getVoteData() {
    this.commonService.get(`Poll/pollChoice/${this.pollId}`).subscribe(res => {
      this.voterProfile = res;
    })
  }

  generateInitials(name: string): string {
    if (!name) return '';
    // Split the name into two parts (like, ["Karan", "Tandel"])
    const nameParts = name.split(' ');
    // Take the first letter from each part and join them (like, "KT")
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return initials.toUpperCase(); // Convert to uppercase (optional)
  }

  // Replace 'wwwroot\\' with an empty string to remove it from the file path
  transformImagePath(filePath: string): string {
    return this.attachmentUrl + filePath.replace('wwwroot\\', '');
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

  onList() {
    this.router.navigate(['admin/poll-list']);
  }

}
