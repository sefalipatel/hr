import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from 'src/app/service/common/common.service';
import { ToastType } from 'src/app/service/common/common.model';
import { MatSelectModule } from '@angular/material/select';
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'app-addsuggestions',
  templateUrl: './addsuggestions.component.html',
  styleUrls: ['./addsuggestions.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    MatButtonModule,
    FormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, LoaderComponent]
})
export class AddsuggestionsComponent {
  suggestionsForm: FormGroup;
  isView?: boolean;
  onlyFileType = ".png, .jpg, .jpeg";
  selectedFiles: File[];
  filelist: any = [];
  id: string = '';
  loading: boolean = false
  isSubmitting: boolean = false;
  constructor(private _fb: FormBuilder, private router: Router, private activeRoute: ActivatedRoute, private apiService: ApiService, private api: CommonService) {
    this.suggestionsForm = this._fb.group({
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      Comment: ['', [Validators.required, Validators.maxLength(500)]],
      suggestionType: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.id = this.activeRoute.snapshot.params['id'] ?? '';
  }
  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    for (let i = 0; i < event.target.files; i++) {
      this.selectedFiles.push(event.target.files[i]);
    }
    if (this.selectedFiles.length > 0) {
      for (const row of this.selectedFiles) {
        this.filelist.push(row);
      }
    }
  }

async createSuggestions() {
  if(this.isSubmitting){
    return
  }
  if (this.suggestionsForm.invalid) {
    this.suggestionsForm.markAllAsTouched();
    return;
  }
  this.isSubmitting = true;
  const formData: FormData = new FormData();

  for (const row of this.filelist) {
    formData.append('File', row);
  }
  formData.append('subject', this.suggestionsForm.get('subject').value);
  formData.append('Comment', this.suggestionsForm.get('Comment').value);
  formData.append('SuggestionType', this.suggestionsForm.get('suggestionType').value);

  let result = await this.apiService.addSuggestion(formData);
  
  if (result) {
    let selectedType = this.suggestionsForm.get('suggestionType')?.value;
    let toastMessage = '';

    switch (selectedType) {
      case 0:
        toastMessage = 'Suggestion has been added sucessfully';
        break;
      case 1:
        toastMessage = 'Feedback has been added sucessfully';
        break;
      case 2:
        toastMessage = 'Complaint has been added sucessfully';
        break;
      case 3:
        toastMessage = 'Announcement has been added sucessfully';
        break;
    }

    this.api.showToast(toastMessage, ToastType.SUCCESS, ToastType.SUCCESS);
    this.isSubmitting = false;
    this.navigate();
  }
}
trimNameOnBlur(controlName: string) {
  const control = this.suggestionsForm.get(controlName);
  if (control?.value) {
    const trimmedValue = control.value.trim();
    control.setValue(trimmedValue, { emitEvent: false });
  }
}

  navigate() {
    this.router.navigateByUrl('/feedback-suggestions');
  }

  seggestiontypeEnum: { value: number, key: string }[] = [
    { value: 0, key: 'Suggestion' },
    { value: 1, key: 'Feedback' },
    { value: 2, key: 'Complain' },
    { value: 3, key: 'Announcement' }
  ]
}
