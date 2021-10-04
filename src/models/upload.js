import { upload, uploadWatermark } from '@/services/upload';

export default {
  namespace: 'upload',
  state: {},
  effects: {
    *UPLOAD({ payload, callback }, { call }) {
      try {
        const response = yield call(upload, payload);
        if (response) callback(response);
      } catch (err) {
        callback(null, err);
      }
    },
    *UPLOAD_WATER_MARK({ payload, callback }, { call }) {
      try {
        const response = yield call(uploadWatermark, payload);
        if (response) callback(response);
      } catch (err) {
        callback(null, err);
      }
    },
  },
};
