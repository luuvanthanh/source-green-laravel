import * as services from '@/services/login';
import { history } from 'umi';
import { notification } from 'antd';
import { last } from 'lodash';
import Cookies from 'universal-cookie';
import { AbilityBuilder } from '@casl/ability';
import ability from '@/utils/ability';

const permission = ['QLTK', 'QLTK_VIEW', 'QLTK_NEW', 'QLTK_EDIT', 'QLTK_DELETE'];
const splitPermission = (string) => {
  const type = last(string?.split('_'));
  const name = string?.slice(0, string.length - type.length - 1);
  return [type, name];
};
const cookies = new Cookies();
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    authorized: false,
    user: {},
    permissions: ['QLTK', 'QLTK_VIEW', 'QLTK_NEW', 'QLTK_EDIT', 'QLTK_DELETE'],
  },
  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(services.login, payload);
        const me = yield call(services.me, {
          access_token: response.access_token,
          token_type: response.token_type,
        });
        if (me) {
          yield put({
            type: 'SET_USER',
            payload: {
              ...me,
              authorized: true,
              permissions: permission,
            },
          });
          cookies.set('access_token', response.access_token, { path: '/' });
          cookies.set('token_type', response.token_type, { path: '/' });
          const { can, rules } = new AbilityBuilder();
          permission.forEach((item) => {
            if (splitPermission(item)[0] === 'VIEW') {
              can(['VIEW'], splitPermission(item)[1]);
            }
            if (splitPermission(item)[0] === 'NEW') {
              can(['NEW'], splitPermission(item)[1]);
            }
          });
          ability.update(rules);
        }
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Đăng nhập không thành công. Bạn vui lòng kiểm tra lại thông tin đã nhập.',
        });
        yield put({
          type: 'SET_ERROR',
        });
      }
    },
    *LOAD_CURRENT_ACCOUNT({ payload }, saga) {
      try {
        const response = yield saga.call(services.me, {
          access_token: payload.access_token,
          token_type: payload.token_type,
        });
        if (response) {
          yield saga.put({
            type: 'SET_USER',
            payload: {
              ...response,
              authorized: true,
              permissions: permission,
            },
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *LOGOUT(_, saga) {
      try {
        cookies.remove('access_token', { path: '/' });
        cookies.remove('token_type', { path: '/' });
        yield saga.put({
          type: 'SET_LOGOUT',
        });
        history.push('/login');
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
  },
  reducers: {
    SET_USER: (state, { payload }) => ({
      ...state,
      user: {
        ...payload,
      },
      authorized: true,
      permissions: payload.permissions,
    }),
    SET_LOGOUT: (state) => ({
      ...state,
      user: {},
      authorized: false,
      permissions: [],
    }),
  },
  subscriptions: {
    setup: ({ dispatch }) => {
      dispatch({
        type: 'LOAD_CURRENT_ACCOUNT',
        payload: {
          access_token: cookies.get('access_token'),
          token_type: cookies.get('token_type'),
        },
      });
    },
  },
};
export default UserModel;
