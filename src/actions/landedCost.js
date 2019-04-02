/* eslint-disable camelcase */
import axios from 'axios';
import { FETCH_SHIPPING_CALC } from './types';
const URL = 'https://76d1lny6hl.execute-api.us-west-2.amazonaws.com/v1/route';

export const fetchOrderSuccess = shipping_calc => ({
  type: FETCH_SHIPPING_CALC,
  shipping_calc,
});

export default function fetchShippingCalc(origin, destination) {
  axios.defaults.headers.common.Authorization = localStorage.getItem('id_token');
  return async (dispatch) => {
    try {
      const orders = await axios.get(`${URL}/${origin}_${destination}`);
      dispatch(fetchOrderSuccess(orders.data));
    } catch (err) {
      if (err.response.status === 401 || 304) {
        return err
      }
    }
  };
}
