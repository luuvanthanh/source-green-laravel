import { notification } from 'antd';
import { upload } from '@/services/upload';

export default {
  namespace: 'upload',
  state: {},
  effects: {
    *UPLOAD({ payload, callback }, { call }) {
      try {
        const response = yield call(upload, payload);

        if (response) callback(response);

        notification.success({
          message: 'Upload dữ liệu thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
      } catch (err) {
        callback(null, err);

        notification.success({
          message: 'Upload dữ liệu thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
      }
    },
  },
};
