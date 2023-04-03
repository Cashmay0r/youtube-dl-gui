//Const Sentry = require('@sentry/electron');
//Const Tracing = require('@sentry/tracing');
//Const version = require('./package.json').version;
const {contextBridge, ipcRenderer} = require('electron');

//
//Function initSentry() {
//If (process.argv[2] === '--dev' && !process.argv.includes('--sentry')) return;
//Sentry.init({
//Dsn: process.env.SENTRY_DSN,
//Release: 'youtube-dl-gui@' + version,
//SendDefaultPii: true,
//Integrations: [new Tracing.Integrations.BrowserTracing()],
//TracesSampleRate: process.argv[2] === '--dev' ? 1.0 : 0.01,
//Environment: process.argv[2] === '--dev' ? 'development' : 'production',
//AutoSessionTracking: true,
//});
//}

//InitSentry();

contextBridge.exposeInMainWorld('main', {
  invoke: async (channel, data) => {
    let validChannels = [
      'platform',
      'messageBox',
      'errorReport',
      'titlebarClick',
      'openInputMenu',
      'openCopyMenu',
      'settingsAction',
      'videoAction',
      'cookieFile',
      'downloadFolder',
      'installUpdate',
      'iconProgress',
      'theme',
      'restoreTaskList',
      'getDoneActions',
      'setDoneAction',
      'getSubtitles',
      'getSelectedSubtitles',
      'getLog',
      'saveLog',
    ];
    if (validChannels.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
  },
  receive: (channel, cb) => {
    let validChannels = [
      'log',
      'error',
      'toast',
      'maximized',
      'videoAction',
      'updateGlobalButtons',
      'updateLinkPlaceholder',
      'totalSize',
      'binaryLock',
      'addShortcut',
      'downloadShortcut',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, arg) => {
        cb(arg);
      });
    }
  },
});
