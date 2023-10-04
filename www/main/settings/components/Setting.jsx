import React from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';

import { Switch, Checkbox } from '../../common/sttm-ui';
import { convertToCamelCase } from '../../common/utils';

const remote = require('@electron/remote');

const { i18n } = remote.require('./app');
const analytics = remote.getGlobal('analytics');

const Setting = ({ settingObj, stateVar, stateFunction }) => {
  const { title, type, min, max, step, options } = settingObj;
  const userSettings = useStoreState((state) => state.userSettings);
  const userSettingsActions = useStoreActions((state) => state.userSettings);

  const handleInputChange = (event) => {
    const value = event.target ? event.target.value : event;
    const { disableSetting } = settingObj;
    userSettingsActions[stateFunction](value);
    if (value && disableSetting) {
      if (userSettings[convertToCamelCase(disableSetting)] !== false) {
        userSettingsActions[`set${convertToCamelCase(disableSetting, true)}`](false);
      }
    }
    analytics.trackEvent({
      category: 'setting',
      action: userSettingsActions[stateFunction],
      label: value,
    });
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.checked;
    userSettingsActions[stateFunction](value);
    analytics.trackEvent({
      category: 'setting',
      action: userSettingsActions[stateFunction],
      label: value,
    });
  };

  let settingDOM;

  switch (type) {
    case 'range':
      settingDOM = (
        <>
          <p className="range-value">{userSettings[stateVar]}</p>
          <input
            type="range"
            data-value={userSettings[stateVar]}
            value={userSettings[stateVar]}
            min={min}
            max={max}
            step={step}
            onChange={handleInputChange}
          ></input>
        </>
      );
      break;
    case 'dropdown':
      settingDOM = (
        <select value={userSettings[stateVar]} onChange={handleInputChange}>
          {Object.keys(options).map((op, opIndex) => (
            <option key={`control-dropdown-options-${opIndex}`} value={op}>
              {i18n.t(`SETTINGS.${options[op]}`)}
            </option>
          ))}
        </select>
      );
      break;
    case 'switch':
      settingDOM = (
        <Switch
          controlId={`${title}-switch`}
          className={`control-item-switch-${title}`}
          value={userSettings[stateVar]}
          onToggle={handleInputChange}
          disabled={userSettings[convertToCamelCase(settingObj.disableWhen)]}
        />
      );
      break;
    case 'checkbox':
      settingDOM = (
        <Checkbox
          id={`${title}-checkbox`}
          name={`control-item-checkbox-${title}`}
          handler={handleCheckboxChange}
          checked={userSettings[stateVar]}
        />
      );
      break;
    default:
      return null;
  }

  return settingDOM;
};

Setting.propTypes = {
  settingObj: PropTypes.object,
  stateVar: PropTypes.string,
  stateFunction: PropTypes.string,
};

export default Setting;
