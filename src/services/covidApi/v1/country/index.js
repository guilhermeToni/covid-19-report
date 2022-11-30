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
   * @param {string} params.date - date to search
   *
   * @return {Promise<*>}
   */
  async getByCountry(params = {}) {
    const { country = 'brazil', date = '' } = params;

    const [day, month, year] = date.split('/');

    const dateFormatted = date ? `/${year}${month}${day}` : '';

    const url = `/report/v1/${country}${dateFormatted}`;

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

  /**
   * @author Guilherme Toni <guilhermedelly8@gmail.com>
   *
   * @async
   * @description Get covid-19 reports from all countries
   *
   * @return {Promise<*>}
   */
  async getAllCountries() {
    try {
      const { data = {} } = await axios.get('/report/v1/countries');
      return data.data || {};
    } catch (ex) {
      const { message = '' } = ex;

      return logError({
        prefix: 'fail-to-get-countries',
        message,
      });
    }
  },
};
