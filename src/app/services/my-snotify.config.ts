import { SnotifyPosition } from 'ng-snotify';

export const MySnotifyConfig = {
  global: {
    newOnTop: true,
    maxOnScreen: 8,
    maxAtPosition: 8,
    filterDuplicates: false
  },
  toast: {
    type: 'error',
    showProgressBar: true,
    timeout: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    bodyMaxLength: 150,
    titleMaxLength: 16,
    backdrop: -1,
    icon: null,
    iconClass: null,
    html: null,
    position: SnotifyPosition.rightTop,
    animation: {enter: 'fadeIn', exit: 'fadeOut', time: 400},
  },
  type: {
    prompt: {
      timeout: 0,
      closeOnClick: false,
      buttons: [
        {text: 'Ok', action: null, bold: true},
        {text: 'Cancel', action: null, bold: false},
      ],
      placeholder: 'Enter answer here...',
      type: 'prompt',
    },
   confirm: {
      timeout: 0,
      closeOnClick: false,
      buttons: [
        {text: 'Ok', action: null, bold: true},
        {text: 'Cancel', action: null, bold: false},
      ],
      type: 'confirm',
    },
   simple: {
      type: 'simple'
    },
    success: {
      type:  'success'
    },
    error: {
    showProgressBar: false,
    timeout: 5000,
      type: 'error'
    },
    warning: {
      type: 'warning'
    },
    info: {
      type: 'info'
    },
    async: {
      pauseOnHover: false,
      closeOnClick: false,
      timeout: 0,
      showProgressBar: false,
      type: 'async'
    }
  }
};
