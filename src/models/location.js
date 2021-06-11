import * as services from '@/services/location';
import { get } from 'lodash';

export default {
  namespace: 'locationCurrent',
  state: {},
  reducers: {
    SET_LOCATION: (state, { payload }) => ({ ...state, ...payload }),
  },
  effects: {
    *GET_LOCATION({ payload }, { call, put }) {
      try {
        const response = yield call(services.getLocation, payload);
        yield put({
          type: 'SET_LOCATION',
          payload: {
            lat: payload.lat,
            lng: payload.lng,
            country: get(response, 'features[0].context').find(
              (item) => item.id.search('country') > -1,
            )?.text,
            regio: get(response, 'features[0].context').find(
              (item) => item.id.search('region') > -1,
            )?.text,
          },
        });
      } catch (err) {
        yield put({
          type: 'SET_ERROR',
        });
      }
    },
    *SEARCH_LOCATION({ payload, callback }, { call }) {
      try {
        const response = yield call(services.searchLocation, payload);
        callback(response);
      } catch (err) {
        callback(null, err);
      }
    },
  },
  subscriptions: {
    setup: ({ dispatch }) => {
      navigator.geolocation.getCurrentPosition((position) => {
        dispatch({
          type: 'GET_LOCATION',
          payload: {
            lat: position?.coords?.latitude,
            lng: position?.coords?.longitude,
            access_token: ACCESS_TOKEN_MAPBOX,
            language: 'vi',
          },
        });
      });
    },
  },
};
