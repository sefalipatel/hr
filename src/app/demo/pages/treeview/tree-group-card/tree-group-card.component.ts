import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeItemCardComponent } from '../tree-item-card/tree-item-card.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tree-group-card',
  standalone: true,
  imports: [CommonModule, TreeItemCardComponent],
  templateUrl: './tree-group-card.component.html',
  styleUrls: ['./tree-group-card.component.scss']
})
export class TreeGroupCardComponent {

  @Input() public item;
  imageUrl: string = `${environment.apiUrl}`.replace('api/', '');
  
  transformImage(image: string): string {
    return this.imageUrl + image.replace('wwwroot\\', '');
  }
}
