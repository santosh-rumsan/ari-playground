import Swal, { SweetAlertOptions } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './style.scss';

type HookReturnType = ReturnType<typeof withReactContent>;

export const useSwal = (): HookReturnType => {
  const MySwal: HookReturnType = withReactContent(Swal);

  return MySwal;
};

export const useConfirm = (options: SweetAlertOptions = {}) => {
  options = {
    ...{
      title: 'Are you sure?',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
    },
    ...options,
  };
  const MySwal = useSwal();
  return (fnOptions: SweetAlertOptions) => {
    return MySwal.fire({ ...options, ...fnOptions });
  };
};
