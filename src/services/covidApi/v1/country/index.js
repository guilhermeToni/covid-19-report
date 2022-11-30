import axios from 'src/services/covidApi/v1/http';
import { logError } from 'src/services/helper';

export default {
  /**
   * @author Guilherme Toni <guilhermedelly8@gmail.com>
   *
   * @async
   * @description Get covid-19 reports by country
   *
   * @param {object} params - params to get cases by country
   * @param {string} params.country=brazil - country name
   *
   * @return {Promise<*>}
   */
  async getByCountry(params = {}) {
    console.log('params', params);
    let {
      country = 'brazil',
    } = params;

    if (!country) {
      return logError({
        prefix: 'empty-required-parameter',
        message: 'country name is required',
      });
    }

    country = country.toLowerCase();

    const url = `/report/v1/${country}`;

    try {
      const { data = {} } = await axios.get(url);
      return data.data || {};
    } catch (ex) {
      const { message = '' } = ex;

      return logError({
        prefix: 'fail-to-get-country',
        message,
      });
    }
  },
};
