import * as services from '@/services/login';
import { history } from 'umi';
import { notification } from 'antd';
import Cookies from 'universal-cookie';
import { AbilityBuilder } from '@casl/ability';
import ability from '@/utils/ability';

const cookies = new Cookies();
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    authorized: false,
    user: {},
    permissions: [],
    defaultBranch: {},
  },
  effects: {
    *LOGIN({ payload }, { call, put }) {
      try {
        const response = yield call(services.login, payload);
        const me = yield call(services.me, {
          access_token: response.access_token,
          token_type: response.token_type,
        });
        yield put({
          type: 'SET_USER',
          payload: {
            ...me,
            permissions: me.permissionGrants,
            logged: true,
            authorized: me.isShowAllBranch,
            defaultBranch: me.isShowAllBranch ? null : me.defaultBranch,
          },
        });
        if (!me.isShowAllBranch) {
          history.push({
            pathname: '/switch-branches',
            query: {
              redirect: payload.redirect,
            },
          });
        }
        cookies.set('access_token', response.access_token, { path: '/' });
        cookies.set('token_type', response.token_type, { path: '/' });
        cookies.set('logged', true, { path: '/' });
        const { can, rules } = new AbilityBuilder();
        me.permissionGrants.forEach((item) => {
          can([item], item);
        });
        ability.update(rules);
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
              permissions: response.permissionGrants,
              logged: true,
              authorized: !!cookies.get('logged'),
              defaultBranch: response.isShowAllBranch ? null : response.defaultBranch,
            },
          });
          const { can, rules } = new AbilityBuilder();
          response.permissionGrants.forEach((item) => {
            can([item], item);
          });
          ability.update(rules);
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *SWITCH_BRANCHES({ payload }, saga) {
      try {
        yield saga.call(services.switchBranches, payload);
        yield saga.put({
          type: 'SET_SWITCH_BRANCHES',
          payload,
        });
        if (payload.isReload) {
          window.location.reload();
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *SWITCH_ACCOUNT({ payload }, saga) {
      try {
        yield saga.call(services.switchAccount, payload);
        window.location.reload();
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
        cookies.remove('logged', { path: '/' });
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
    *CHANG_PASSWORK({ payload }, saga) {
      try {
        yield saga.call(services.changePassword, payload);
        if(payload) {
          notification.success({
            message: 'THÔNG BÁO',
            description: 'Đổi mật khẩu thành công.',
          });
        }
      }  catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
  },
  reducers: {
    SET_USER: (state, { payload }) => ({
      ...state,
      ...payload,
      user: {
        ...payload,
      },
      defaultBranch: payload.defaultBranch || {},
      permissions: payload.permissions,
    }),
    SET_SWITCH_BRANCHES: (state, { payload }) => ({
      ...state,
      defaultBranch: state?.branchs?.find((item) => item.id === payload.branchId) || {},
      authorized: true,
    }),
    SET_LOGOUT: (state) => ({
      ...state,
      user: {},
      authorized: false,
      logged: false,
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
