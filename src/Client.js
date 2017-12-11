// Dependencies.
const Common = require('./lib/Common');
const ClientLib = require('./lib/ClientLib');

let uduInstance = null; // Singleton.

/**
 * This module implements public methods for debugging code only on the client side.
 */
class UduJS {
  constructor(customSettingsObj) {
    if (Common.getValueType(ClientLib.windowObj) === 'Window') { // Is the code running in the browser?
      if (!uduInstance) {
        uduInstance = this;
        this.instanceReset = () => {
          uduInstance = null;
        };
        Common.setCustomSettings(customSettingsObj);
        Common.loadColorScheme();
        this.appConfig = Common.config.serviceApp;
        this.executionAllowed = Common.config.runtime.run;
        Common.console.info(...ClientLib.prepareColoring([
          this.appConfig.appDescription, 'heading',
          `${this.appConfig.consoleEOL}Version: ${this.appConfig.appVersion}`, 'slave',
        ]));
        if (!this.executionAllowed) {
          Common.console.info(...ClientLib.prepareColoring([
            Common.getErrorMessage('runningStopped'), 'master',
          ]));
        }

        if (Common.getValueType(ClientLib.performanceNow) === 'Number') { // Does the browser support the "Window.performance" object?
          this.performanceAllowed = true;
        } else {
          this.performanceAllowed = false;
          Common.console.error(`${Common.config.serviceApp.appName}: ${Common.getErrorMessage('constructorClient2')}`);
        }
      }
    } else {
      this.executionAllowed = false;
      this.performanceAllowed = false;
      Common.console.error(`${Common.config.serviceApp.appName}: ${Common.getErrorMessage('constructorClient1')}`);
    }

    return uduInstance;
  }
}

module.exports = UduJS;
