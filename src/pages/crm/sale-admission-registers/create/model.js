export default {
  namespace: 'crmSaleAdmissionAdd',
  state: {
    details: {},
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
    detailsLead: {},
    detailsTags: [],
    detailsReferences: [],
    error: {
      isError: false,
      data: {},
    },
    classTypes: [],
    sensitivePeriods: [],
    parents: [],
    employees: [],
    branches: [],
    classes: [],
    city: [],
    district: [],
    student: [],
    lead: [],
    parentLead: [],
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      detailsLead: {},
      isError: false,
      data: [],
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
      detailsTags: payload,
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
      error: {
        status: null,
        isError: false,
      },
    }),
  },
};
