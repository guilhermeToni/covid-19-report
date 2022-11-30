/**
 * @author Guilherme Toni <guilhermedelly8@gmail.com>
 *
 * @param {object} params - params to trigger error
 *
 * @return Error
 */
export const logError = (params) => {
  const {
    prefix = '',
    message = '',
  } = params;

  const error = `[${prefix}] ${message}`;

  throw error;
};
