import Swal from "sweetalert2";

export const showError = (message: string) => {
    Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `${message}`,
        showConfirmButton: false,
        timerProgressBar: true,
        toast: true,
        timer: 1500
    });
};

export const showSucess = (message: string) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Registrace Uspesna!',
        showConfirmButton: false,
        timerProgressBar: true,
        toast: true,
        timer: 1500
    });
}