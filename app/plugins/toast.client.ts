import { Toaster } from "vue-sonner";

export default defineNuxtPlugin((nuxtApp) => {
  // Registrar o componente globalmente
  nuxtApp.vueApp.component("Toaster", Toaster);
});
