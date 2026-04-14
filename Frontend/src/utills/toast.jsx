import toast from "react-hot-toast";

export const showSuccess = (msg) => toast.success(msg);
export const showError = (msg) => toast.error(msg);

export const showLoading = (msg) => {
  return toast.loading(msg);
};

export const updateToast = (id, type, msg) => {
  toast[type](msg, { id });
};