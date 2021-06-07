import { notification } from 'antd';
import { upload } from '@/services/upload';

export default {
  namespace: 'upload',
  state: {},
  effects: {
    *UPLOAD({ payload, callback, showNotification = true }, { call }) {
      try {
        const response = yield call(upload, payload);

        if (response) callback(response);

        if (showNotification) {
          notification.success({
            message: 'Upload dữ liệu thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (err) {
        callback(null, err);

        if (showNotification) {
          notification.error({
            message: 'Thông báo',
            description: 'Lỗi hệ thống vui lòng kiểm tra lại',
          });
        }
      }
    },
  },
};
