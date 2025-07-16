import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tree-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree-item-card.component.html',
  styleUrls: ['./tree-item-card.component.scss']
})
export class TreeItemCardComponent {

  @Input() public item;
  
  imageUrl: string = `${environment.apiUrl}`.replace('api/', '');
  
  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
}
