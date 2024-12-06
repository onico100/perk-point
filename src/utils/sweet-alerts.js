"use client"
import Swal from 'sweetalert2'

export const beforeActionAlert = async (sendText,action) => {
  const result = await Swal.fire({
    title: "אתה בטוח?",
    text: sendText,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#b346e8",
    cancelButtonColor: "#858282",
    cancelButtonText:`בטל ${action}`,
    confirmButtonText:action,
  });

  return result.isConfirmed; 
};

export const inProccesAlert = async (action) => {
  Swal.fire({
    title: `${action}...`,
    icon: "info",
    showConfirmButton: false
  });
}

export const successAlert = async (action) => {
  Swal.fire({
    title: `${action} בהצלחה!`,
    icon: "success",
    timer: 1500, 
    showConfirmButton: false
  });
}

export const errorAlert = async (action) => {
  Swal.fire({
    title: action,
    icon: "error",
    timer: 1500, 
    showConfirmButton: false
  });
}

export const helloAlert = async (action) => {
  Swal.fire({
    title: action,
    timer: 1500, 
    showConfirmButton: false
  });
}
