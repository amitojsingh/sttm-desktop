import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import anvaad from 'anvaad-js';
import { useStoreState, useStoreActions } from 'easy-peasy';

import { Switch, Overlay } from '../../../common/sttm-ui';
import ExtraBani from './ExtraBani';
import { convertToHyphenCase } from '../../../common/utils';
import { nitnemBaniIds, popularBaniIds } from '../../../common/constants';
import useLoadBani from '../hooks/use-load-bani';

const remote = require('@electron/remote');

const analytics = remote.getGlobal('analytics');
const { i18n } = remote.require('./app');

const SundarGutka = ({ isShowTranslitSwitch = false, onScreenClose }) => {
  const {
    isSundarGutkaBani,
    sundarGutkaBaniId,
    isCeremonyBani,
    singleDisplayActiveTab,
    pane1,
    pane2,
    pane3,
  } = useStoreState((state) => state.navigator);

  const { currentWorkspace } = useStoreState((state) => state.userSettings);

  const {
    setIsSundarGutkaBani,
    setSundarGutkaBaniId,
    setIsCeremonyBani,
    setSingleDisplayActiveTab,
    setPane1,
    setPane2,
    setPane3,
  } = useStoreActions((state) => state.navigator);

  const { isLoadingBanis, banis } = useLoadBani();
  const [isTranslit, setTranslitState] = useState(false);
  const [isEngTransliterated, setEngTransliterate] = useState(false);
  const [paneSelectorActive, setPaneSelectorActive] = useState(false);

  const paneSelector = useRef(null);

  const nitnemBanis = [];
  const popularBanis = [];
  const title = i18n.t('TOOLBAR.SUNDAR_GUTKA');
  const hyphenedTitle = convertToHyphenCase(title.toLowerCase());
  const overlayClassName = `ui-${hyphenedTitle}`;
  const blockListId = `${hyphenedTitle}-banis`;
  const blockListItemClassName = `${hyphenedTitle}-bani`;
  const taggedBanis = banis.map((bani) => {
    const b = bani;
    b.baniTag = '';

    if (nitnemBaniIds.includes(b.id)) {
      b.baniTag = 'nitnem';
      nitnemBanis.push(b);
    }
    if (popularBaniIds.includes(b.id)) {
      b.baniTag = 'popular';
      popularBanis.push(b);
    }

    return b;
  });

  const openPaneMenu = (e, baniId) => {
    paneSelector.current.style.left = `${e.clientX - 100}px`;
    if (window.innerHeight - e.clientY > 200) {
      paneSelector.current.style.top = `${e.clientY - 10}px`;
    } else {
      paneSelector.current.style.top = `${e.clientY - 195}px`;
    }
    paneSelector.current.dataset.baniId = baniId;
    setPaneSelectorActive(true);
  };

  const loadBani = (baniId, paneId = null) => {
    if (isCeremonyBani) {
      setIsCeremonyBani(false);
    }

    if (!isSundarGutkaBani) {
      setIsSundarGutkaBani(true);
    }

    if (sundarGutkaBaniId !== baniId) {
      setSundarGutkaBaniId(baniId);
    }

    if (singleDisplayActiveTab !== 'shabad') {
      setSingleDisplayActiveTab('shabad');
    }

    if (paneId !== null) {
      switch (paneId) {
        case 1:
          setPane1({
            ...pane1,
            content: i18n.t('MULTI_PANE.SHABAD'),
            baniType: 'bani',
            activeShabad: baniId,
          });
          break;
        case 2:
          setPane2({
            ...pane2,
            content: i18n.t('MULTI_PANE.SHABAD'),
            baniType: 'bani',
            activeShabad: baniId,
          });
          break;
        case 3:
          setPane3({
            ...pane3,
            content: i18n.t('MULTI_PANE.SHABAD'),
            baniType: 'bani',
            activeShabad: baniId,
          });
          break;
        default:
          break;
      }
    }

    analytics.trackEvent({
      category: 'sundar-gutka',
      action: 'bani',
      label: baniId,
    });
    onScreenClose();
  };

  const getBani = (e, baniId) => {
    if (currentWorkspace === i18n.t('WORKSPACES.MULTI_PANE')) {
      openPaneMenu(e, baniId);
    } else {
      loadBani(baniId);
    }
  };

  return (
    <Overlay onScreenClose={onScreenClose}>
      <div className={`addon-wrapper ${hyphenedTitle}-wrapper`}>
        <div className={`bani-list overlay-ui ${overlayClassName}`}>
          {isLoadingBanis ? (
            <div className="sttm-loader" />
          ) : (
            <>
              <header className="navigator-header">
                {title}
                <div className="transliterate-eng">
                  <span>{i18n.t('SETTINGS.ENGLISH_LANGUAGE')} </span>
                  <div className="switch xs-small">
                    <input
                      id="translate-eng"
                      type="checkbox"
                      checked={isEngTransliterated}
                      onChange={() => {
                        const newState = !isEngTransliterated;
                        setEngTransliterate(newState);
                      }}
                    />
                    <label htmlFor="translate-eng" />
                  </div>
                </div>
              </header>
              {isShowTranslitSwitch && (
                <Switch
                  controlId="translit-switch"
                  className="translit-switch"
                  onToggle={setTranslitState}
                  value={isTranslit}
                />
              )}

              <section className="blocklist">
                <div
                  ref={paneSelector}
                  className={`history-results multipane-dropdown ${
                    paneSelectorActive ? 'enabled' : 'disabled'
                  }`}
                  onMouseLeave={() => setPaneSelectorActive(false)}
                >
                  <p
                    onClick={() => {
                      loadBani(parseInt(paneSelector.current.dataset.baniId, 10), 1);
                      setPaneSelectorActive(false);
                    }}
                    className="history-item"
                  >
                    Open in Pane 1
                  </p>
                  <p
                    onClick={() => {
                      loadBani(parseInt(paneSelector.current.dataset.baniId, 10), 2);
                      setPaneSelectorActive(false);
                    }}
                    className="history-item"
                  >
                    Open in Pane 2
                  </p>
                  <p
                    onClick={() => {
                      loadBani(parseInt(paneSelector.current.dataset.baniId, 10), 3);
                      setPaneSelectorActive(false);
                    }}
                    className="history-item"
                  >
                    Open in Pane 3
                  </p>
                </div>
                <ul id={blockListId} className={!isEngTransliterated && 'gurmukhi'}>
                  {taggedBanis.map((bani) => (
                    <li
                      key={bani.name}
                      className={blockListItemClassName}
                      onClick={(e) =>
                        currentWorkspace === i18n.t('WORKSPACES.MULTI_PANE')
                          ? openPaneMenu(e, bani.id)
                          : loadBani(bani.id)
                      }
                    >
                      <span className={`tag tag-${bani.baniTag}`} />
                      <span className={isEngTransliterated && 'english-bani'}>
                        {isEngTransliterated ? anvaad.translit(bani.name) : bani.name}
                      </span>
                      <span className="translit-bani">{anvaad.translit(bani.name)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>

        {!isLoadingBanis && (
          <div className={`bani-extras overlay-ui ${overlayClassName}`}>
            {nitnemBanis.length > 0 && (
              <ExtraBani
                title="Nitnem Banis"
                banis={nitnemBanis}
                getBani={getBani}
                isEngTransliterated={isEngTransliterated}
              />
            )}
            {popularBanis.length > 0 && (
              <ExtraBani
                title="Popular Banis"
                banis={popularBanis}
                getBani={getBani}
                isEngTransliterated={isEngTransliterated}
              />
            )}
          </div>
        )}
      </div>
    </Overlay>
  );
};

SundarGutka.propTypes = {
  isShowTranslitSwitch: PropTypes.bool,
  onScreenClose: PropTypes.func,
};

export default SundarGutka;
