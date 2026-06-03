import { toast } from 'react-toastify';

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showInfo = (message) => toast.info(message);

export const handleApiError = (error, fallback = 'Something went wrong') => {
  const message = error?.message || fallback;
  if (error?.errors?.length) {
    error.errors.forEach((e) => toast.error(`${e.field}: ${e.message}`));
  } else {
    toast.error(message);
  }
};
