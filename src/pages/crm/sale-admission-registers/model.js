// import * as services from './services';

export default {
  namespace: 'crmSaleAdmission',
  state: {
    data: [
      {
        id: 1,
        key: 1,
        full_name: 'Nguyễn văn A',
        birth_day : '20/10/2019',
        age: 20,
        time: '20/10/2019',
        name_parents: 'Nguyễn văn Đạt',
        name_mon : 'Nguyễn Thị bé',
        status: 'Đăng ký mới',
      },
      {
        id: 2,
        key: 2,
        full_name: 'Nguyễn văn A',
        birth_day : '20/10/2019',
        age: 20,
        time: '20/10/2019',
        name_parents: 'Nguyễn văn Đạt',
        name_mon : 'Nguyễn Thị bé',
        status: 'Đăng ký mới',
      },
      {
        id: 3,
        key: 3,
        full_name: 'Nguyễn văn A',
        birth_day : '20/10/2019',
        age: 20,
        time: '20/10/2019',
        name_parents: 'Nguyễn văn Đạt',
        name_mon : 'Nguyễn Thị bé',
        status: 'Đăng ký mới',
      },
      {
        id: 4,
        key: 4,
        full_name: 'Nguyễn văn A',
        birth_day : '20/10/2019',
        age: 20,
        time: '20/10/2019',
        name_parents: 'Nguyễn văn Đạt',
        name_mon : 'Nguyễn Thị bé',
        status: 'Đăng ký mới',
      }
    ],
    city: [],
    district: [],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
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
    SET_CITIES: (state, { payload }) => ({
      ...state,
      city: payload.parsePayload,
    }),
    SET_DISTRICTS: (state, { payload }) => ({
      ...state,
      district: payload.parsePayload,
    }),
  },
  subscriptions: {},
};
