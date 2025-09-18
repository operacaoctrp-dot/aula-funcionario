import { toast } from "vue-sonner";

export const useToast = () => {
  const success = (message: string) => {
    console.log("Toast success chamado:", message);
    if (process.client) {
      toast.success(message, {
        duration: 3000,
      });
    }
  };

  const error = (message: string) => {
    console.log("Toast error chamado:", message);
    if (process.client) {
      toast.error(message, {
        duration: 4000,
      });
    }
  };

  const warning = (message: string) => {
    console.log("Toast warning chamado:", message);
    if (process.client) {
      toast.warning(message, {
        duration: 3000,
      });
    }
  };

  const info = (message: string) => {
    console.log("Toast info chamado:", message);
    if (process.client) {
      toast.info(message, {
        duration: 3000,
      });
    }
  };

  return {
    success,
    error,
    warning,
    info,
  };
};
