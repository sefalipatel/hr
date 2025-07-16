import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class OrgPresenterService {


  constructor(private _formBuilder: FormBuilder, private title: Title, @Inject(DOCUMENT) private _document: HTMLDocument,) { }

  initForm() {
    return this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])[a-zA-Z0-9 @$&()_-]+$/)]],
      code: ['', [Validators.required]],
      title: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")]],
      imageLogo: [''],
      imageFavicon: [''],
      description: [''],
      primaryColorCode: ['#000000', [Validators.required, Validators.pattern('^#(?:[0-9a-fA-F]{3,4}){1,2}$'),]],
      secondaryColorCode: ['#000000', [Validators.required, Validators.pattern('^#(?:[0-9a-fA-F]{3,4}){1,2}$')]],
      isActive: [true],
      isTimer: new FormControl(false),
      isCaptured: new FormControl(false),
      is2FA: new FormControl(false),
      timer: [0, [Validators.required, Validators.min(0)]],
      counter: [0, [Validators.required, Validators.min(0)]],
    })
  }


  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateFavIcon(favIcon: string) {
    this._document?.getElementById('appFavicon')?.setAttribute('href', favIcon);
  }

  updatePrimaryColor(color: string) {
    document.documentElement.style.setProperty('--blue', color)

  }
  updateSecondaryColor(color: string) {
    document.documentElement.style.setProperty('--secondarycolor', color)
  }
}
