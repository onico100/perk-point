"use client"
import Swal from 'sweetalert2'

export const beforeActionAlert = async (sendText) => {
  const result = await Swal.fire({
    title: "אתה בטוח?",
    text: sendText,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#b346e8",
    cancelButtonColor: "#858282",
    cancelButtonText: "ביטול",
    confirmButtonText: "אישור",
  });

  return result.isConfirmed; 
};

export const inProccesAlert = async (action) => {
  Swal.fire({
    title: action,
    showConfirmButton: false
  });
}

export const successAlert = async (action) => {
  Swal.fire({
    title: action,
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

export const confirmExternalNavigation = (link) => {
  return Swal.fire({
    title: "אזהרה",
    text: "אתם עומדים לעזוב את האתר, האם ברצונכם להמשיך?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "כן, המשך",
    cancelButtonText: "ביטול",
    reverseButtons: true,
  }).then((result) => result.isConfirmed);
};

export const confirmChangesAlert = async () => {
  const result = await Swal.fire({
    title: "האם אתה בטוח?",
    text: "האם אתה רוצה לשמור את השינויים?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#b346e8",
    cancelButtonColor: "#858282",
    cancelButtonText: "לא, ביטול",
    confirmButtonText: "כן, שמור שינויים",
  });

  return result.isConfirmed;
};
