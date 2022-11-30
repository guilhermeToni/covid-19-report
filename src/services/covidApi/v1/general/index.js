import axios from 'src/services/covidApi/v1/http';
import { logError } from 'src/services/helper';

export default {
  /**
   * @author Guilherme Toni <guilhermedelly8@gmail.com>
   *
   * @async
   * @description Get api status
   *
   * @return {Promise<*>}
   */
  async getApiStatus() {
    try {
      const { data = {} } = await axios.get('/status/v1');
      return data || {};
    } catch (ex) {
      return logError(ex);
    }
  },
};
