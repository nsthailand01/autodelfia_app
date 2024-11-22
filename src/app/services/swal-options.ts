import Swal from 'sweetalert2';

export async function provideSwal() {
  return Swal.mixin({
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-primary w-25 mr-2',
      cancelButton: 'btn btn-secondary w-25'
      // confirmButton: 'btn btn-lg btn-primary',
      // cancelButton: 'btn btn-lg btn-default'
    },
    // confirmButtonColor: '#9600FF',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  });
}
