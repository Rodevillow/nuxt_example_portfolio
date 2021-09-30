
export default function({ $axios, $toast,$i18n }) {

  const interceptor = $axios.interceptors.response.use( (response) => {
    if(process.server) {
      $axios.interceptors.response.eject(interceptor);
    }
    return response;
  }, function (error) {
    if (error?.response?.data?.error) {
      $toast.error(error?.response?.data?.error);
    } else {
      $toast.error($i18n.$t('ERROR_SERVER'));
    }
    if(process.server) {
      $axios.interceptors.response.eject(interceptor);
    }

    return Promise.reject(error);
  });

}
