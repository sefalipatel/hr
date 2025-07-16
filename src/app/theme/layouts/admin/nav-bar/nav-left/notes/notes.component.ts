import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/service/common/common.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule,SharedModule,FormsModule,CdkDrag],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent {
  recognition:any;
  personId:any;
  stickyNote:any;
  @Input()
  content: string;
  @Input()
  note: any;
  @Output() focusout = new EventEmitter();
  @Output() dismiss = new EventEmitter();
  @Output() onAdd = new EventEmitter();
  description : FormControl = new FormControl('');



  constructor(private el:ElementRef,private _commonService: CommonService) {  
  }
  
  ngOnInit(){
    this.personId = JSON.parse(localStorage.getItem('userInfo')).personID;
  }


  showHide(action){
    if(action === "add") {
      document.getElementsByClassName('voice')[0].classList.add("show");
    } else {
       document.getElementsByClassName('voice')[0].classList.remove("show");
    }
  }
  onDismiss(event){
    this.dismiss.emit(event);
  }
  
  onFocusOut(event){
    this.focusout.emit(event)
  }

  record(event) {
    this.showHide("remove");
    this.recognition.start();
  }

  saveAddNote(){
    this.saveNote();
  }

  saveNote(){    
    let payload:any = {
      personId : this.personId,
      description : this.content,
      date : new Date(),
    }
    if(this.note?.id){
      payload = {
        ...payload,
        id:this.note.id
      }
      this._commonService.put(`StickyNotes`,payload).subscribe(res => {
        if(res){
          this.getAllNotes();
          this.focusout.emit(event)
          this.description.reset();
        }        
      })
    } else{
      this._commonService.post(`StickyNotes`,payload).subscribe(res => {
        if(res){
          this.note = res?.value;
          this.getAllNotes();
          this.focusout.emit(event)
          this.description.reset();
        }        
      })
    }
  }

  addNote(){
  this.onAdd.emit();
  }

  getAllNotes(){
    this._commonService.get(`StickyNotes/StickyNotesByPersonId`).subscribe(res => {
      this.stickyNote = res;      
    })
  }

  onKeypressEvent(event: any){
    if(event.key=='Enter'){
      this.saveNote();
    }
  }

}
