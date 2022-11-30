// import something here
import covidApiV1 from 'src/services/covidApi/v1';

export default async ({ Vue }) => {
  Object.defineProperty(Vue.prototype, '$services', {
    enumerable: false,
    configurable: true,
    get() {
      return {
        covidApiV1,
      };
    },
  });
};
