import axios from 'src/services/covidApi/v1/http';
import { logError } from 'src/services/helper';

export default {
  /**
   * @author Guilherme Toni <guilhermedelly8@gmail.com>
   *
   * @async
   * @description Get covid-19 reports from specific brazilian state
   *
   * @param {object} params - params to get cases by state
   * @param {string} params.state=sp - state abbr
   *
   * @return {Promise<*>}
   */
  async getByState(params = {}) {
    console.log('params', params);
    const {
      state = 'sp',
    } = params;

    if (!state) return logError({ message: 'state abbr is required' });

    try {
      const url = `/report/v1/brazil/uf/${state}`;
      console.log('url', url);

      const { data = {} } = await axios.get(url);
      return data || {};
    } catch (ex) {
      return logError(ex);
    }
  },

  /**
   * @author Guilherme Toni <guilhermedelly8@gmail.com>
   *
   * @async
   * @description Get covid-19 reports from all brazilian states
   *
   * @return {Promise<*>}
   */
  async getAll() {
    try {
      const { data = {} } = await axios.get('/report/v1');
      return data.data || {};
    } catch (ex) {
      return logError(ex);
    }
  },
};
