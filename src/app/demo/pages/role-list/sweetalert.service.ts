import { Injectable, Input } from '@angular/core';
// import Swal from 'sweetalert2';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor() { }

  @Input() title = "Are you sure?";
  @Input() text = 'You won\'t be able to revert this!';
  @Input() confirmButtonText = 'Yes, delete it!';
  @Input() cancelButtonText = 'Cancel';

  deleteBtn() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success px-4 py-2 rounded-pill me-3',
        cancelButton: 'me-3 btn btn-danger px-4 py-2 rounded-pill'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

  async showDeleteConfirmation(config?: any) {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary px-4 py-2 rounded-pill me-3',
        cancelButton: 'me-3 btn btn-danger px-4 py-2 rounded-pill'
      },
      buttonsStyling: false
    })

    const result = await swalWithBootstrapButtons.fire({
      title: config?.title ?? this.title,
      text: config?.text ?? this.text,
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: config?.confirm ?? this.confirmButtonText,
      cancelButtonText: config?.cancel ?? this.cancelButtonText,
      reverseButtons: false
    })
    return result.isConfirmed;
  }

  async showStatusConfirmation() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary px-4 py-2 rounded-pill me-3',
        cancelButton: 'me-3 btn btn-danger px-4 py-2 rounded-pill'
      },
      buttonsStyling: false
    })

    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure you want to approve the feedback/suggestion of the employee?',
      text: this.text,
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it',
      cancelButtonText: this.cancelButtonText,
      reverseButtons: false
    })
    return result.isConfirmed;
  }

  async activeStatusConfirmation() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary px-4 py-2 rounded-pill me-3',
        cancelButton: 'me-3 btn btn-danger px-4 py-2 rounded-pill'
      },
      buttonsStyling: false
    })

    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure want to change the status?',
      text: '  ',
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it',
      cancelButtonText: this.cancelButtonText,
      reverseButtons: false
    })
    return result.isConfirmed;
  }

  async showCancleConfirmation() {
    let title = "You have unsaved changes ? ";
    let text = 'You have unsaved changes !';
    let confirmButtonText = 'Yes, Ignore it!';
    let cancelButtonText = 'Cancel';

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary px-4 py-2 rounded-pill me-3',
        cancelButton: 'me-3 btn btn-danger px-4 py-2 rounded-pill'
      },
      buttonsStyling: false
    })

    const result = await swalWithBootstrapButtons.fire({
      title: title,
      text: text,
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      reverseButtons: false
    })
    return result.isConfirmed;


  }

  async showApproveConfirmation() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary px-4 py-2 rounded-pill me-3',
        cancelButton: 'me-3 btn btn-danger px-4 py-2 rounded-pill'
      },
      buttonsStyling: false
    })

    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure want to approve the resignation of the employee ?',
      text: this.text,
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: this.cancelButtonText,
      reverseButtons: false
    })
    return result.isConfirmed;
  }
}
