import { remote } from 'electron';
import React, { useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

const { i18n } = remote.require('./app');

function MiscFooter() {
  const { isEmptySlide, isWaheguruSlide } = useStoreState(state => state.navigator);
  const { setIsEmptySlide, setIsWaheguruSlide, setVerseHistory } = useStoreActions(
    state => state.navigator,
  );
  // For Global States
  // const navigatorState = useStoreActions(state => state.navigator);
  // For shortcut tray
  const [shortcutOpen, setShortcutOpen] = useState(true);
  const HandleChange = () => {
    setShortcutOpen(!shortcutOpen);
  };

  // Event Handlers
  const clearHistory = () => {
    setVerseHistory([]);
  };

  const openWaheguruSlide = () => {
    if (isEmptySlide) {
      setIsEmptySlide(false);
    }
    if (!isWaheguruSlide) {
      setIsWaheguruSlide(true);
    }
  };

  const openBlankViewer = () => {
    if (!isEmptySlide) {
      setIsEmptySlide(true);
    }
  };

  return (
    <div className="misc-footer">
      <div className="clear-pane">
        <div
          className={`${!shortcutOpen ? 'footer-toggler' : 'footer-toggler-inactive '}`}
          onClick={HandleChange}
        >
          <i className={`${shortcutOpen ? 'fa fa-caret-down' : 'fa fa-caret-up'}`} />
        </div>
        <a className="clear-history" onClick={clearHistory}>
          <i className="fa fa-history" />
          <span>Clear History</span>
        </a>
      </div>
      <div className={`${shortcutOpen ? 'shortcut-drawer-active' : 'shortcut-drawer'}`}>
        <button className="tray-item-icon">{i18n.t(`SHORTCUT_TRAY.ANAND_SAHIB`)}</button>
        <button className="tray-item-icon">{i18n.t(`SHORTCUT_TRAY.MOOL_MANTRA`)}</button>
        <button className="gurmukhi tray-item-icon" onClick={() => openWaheguruSlide()}>
          vwihgurU
        </button>
        <button className="tray-item-icon" onClick={() => openBlankViewer()}>
          {i18n.t(`SHORTCUT_TRAY.BLANK`)}
        </button>
      </div>
    </div>
  );
}

export default MiscFooter;
