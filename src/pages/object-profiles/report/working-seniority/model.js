export default {
  namespace: 'OPWorkingSeniority',
  state: {
    data: [
      {
        key: 1,
        code: 'NV00001',
        name: 'Đỗ Thị Huyền',
        position: 'Trưởng phòng',
        branch: 'Hội sở',
        start_date: '31/12/2018',
        year_working: 3,
        month_working: 0,
      },
      {
        key: 2,
        code: 'NV00002',
        name: 'Phạm Thị Loan',
        position: 'Giáo viên',
        branch: 'Lake View City',
        start_date: '31/08/2020',
        year_working: 1,
        month_working: 4,
      },
    ],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
    branches: [],
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state }),
  },
  effects: {},
  subscriptions: {},
};
