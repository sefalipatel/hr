import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotesComponent } from '../notes/notes.component';
import { CommonService, ToastType } from 'src/app/service/common/common.service';
import { log } from 'console';

@Component({
  selector: 'app-sticky-note',
  standalone: true,
  imports: [CommonModule, SharedModule, NotesComponent],
  templateUrl: './sticky-note.component.html',
  styleUrls: ['./sticky-note.component.scss']
})
export class StickyNoteComponent {
  notes = [];
  stickyNote: any;
  sweetlalert: any;

  constructor(private _commonService: CommonService) { }

  ngOnInit() {
    this.getAllNotes();
  }

  addNote() {
    this.notes.push({ id: '', content: '' });
    // sort the array
    this.notes = this.notes.sort((a, b) => { return b.id - a.id });
    localStorage.setItem('notes', JSON.stringify(this.notes));
  };
  onNoteSelect(note) {
    this.notes.push(note);
  }
  saveNote(event) {
    const id = event.srcElement.parentElement.parentElement.getAttribute('id');
    const content = event.target.value; 
  }

  updateNote(newValue) {
    this.notes.forEach((note, index) => {
      if (note.id == newValue.id) {
        this.notes[index].content = newValue.content;
      }
    });
  }

  getAllNotes() {
    this._commonService.get(`StickyNotes/StickyNotesByPersonId`).subscribe(res => {
      this.stickyNote = res;
    })
  }

  async deleteStickyNote(id) {
    this._commonService.delete(`StickyNotes/${id}`).subscribe(res => {
      if (res == true) {
        this._commonService.showToast('StickyNotes deleted successfully', ToastType.SUCCESS, ToastType.SUCCESS)
        this.getAllNotes();
      } else {
        this._commonService.showToast(res?.errors[0].errorMessage, ToastType.ERROR, ToastType.ERROR)
      }
    }, (err) => {
      this._commonService.showToast("Something went wrong", ToastType.ERROR, ToastType.ERROR)
    })
  }

  deleteNote(event, note) {
    const id = note.id;
    this.notes.forEach((note, index) => {
      if (note.id == id) {
        this.notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(this.notes));
        return;
      }
    });
  }
}
