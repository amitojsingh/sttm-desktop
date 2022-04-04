import Noty from 'noty';
import { remote } from 'electron';
import banidb from '../../banidb';

const { i18n } = remote.require('./app');

export const loadShabad = (shabadID, lineID) => {
  return banidb
    .loadShabad(shabadID, lineID)
    .then(rows => rows)
    .catch(err => {
      const dbStatus = !!localStorage.getItem('isDbDownloaded');
      if (dbStatus) {
        new Noty({
          type: 'error',
          text: `${i18n.t('BANI.DATABASE_DOWNLOADING')}`,
          timeout: 5000,
          modal: true,
        }).show();
      } else {
        new Noty({
          type: 'error',
          text: `${i18n.t('BANI.LOAD_ERROR', { erroneousOperation: 'Shabad' })} : ${err}`,
          timeout: 5000,
          modal: true,
        }).show();
      }
    });
};