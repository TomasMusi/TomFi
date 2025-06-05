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
        title: message,
        showConfirmButton: false,
        timerProgressBar: true,
        toast: true,
        timer: 1500
    });
}


export const showInputAlert = (message: string, messageButton: string) => {
    Swal.fire({
        title: message,
        input: "text",
        inputAttributes: {
            autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: messageButton,
        showLoaderOnConfirm: true,
        preConfirm: async (password: string) => {
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    body: JSON.stringify(password),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                if (!response.ok) {
                    return Swal.showValidationMessage(`
          ${JSON.stringify(await response.json())}
        `);
                }
                return response.json();
            } catch (error) {
                Swal.showValidationMessage(`
        Failed: ${error}
      `);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: `${result.value.login}'s avatar`,
                imageUrl: result.value.avatar_url
            });
        }
    });
}


