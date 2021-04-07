import { notification } from 'antd';
import { get, isEmpty } from 'lodash';
import * as services from './services';

export default {
  namespace: 'allocationChangeClass',
  state: {
    data: [],
    pagination: {},
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    UPDATE_DATA: (state, { payload }) => ({
      ...state,
      data: state.data.map((item) =>
        item.id === payload.id ? { ...item, status: payload.status } : item,
      ),
    }),
  },
  effects: {
    *GET_DATA({ payload }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DATA',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *REMOVE({ payload }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        yield saga.put({
          type: 'GET_DATA',
          payload: payload.pagination,
        });
        notification.success({
          message: 'THÔNG BÁO',
          description: 'Dữ liệu cập nhật thành công',
        });
      } catch (error) {
        if (!isEmpty(error?.data?.errors)) {
          notification.error({
            message: 'Thông báo',
            description:
              'Ca đang được sử dụng, xóa ca sẽ thay đổi các ca xếp sẵn từ hiện tại. Giữ liệu cũ vẫn được giữ nguyên',
          });
        }
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE_CONFIG({ payload }, saga) {
      try {
        const response = yield saga.call(services.activeStatus, payload);
        if (response) {
          yield saga.put({
            type: 'UPDATE_DATA',
            payload: response.parsePayload,
          });
        }
      } catch (error) {
        if (!isEmpty(error.data.errors)) {
          notification.error({
            message: 'Thông báo',
            description:
              'Ca đang được sử dụng, sửa ca sẽ thay đổi các ca xếp sẵn từ hiện tại. Giữ liệu cũ vẫn được giữ nguyên',
          });
        }
      }
    },
  },
  subscriptions: {},
};
