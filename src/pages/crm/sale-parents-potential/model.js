export default {
  namespace: 'crmSaleParentsPotential',
  state: {
    data: [
      {
        id:1,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
      {
        id: 2,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
      {
        id: 3,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
      {
        id: 4,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
      {
        id: 5,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
      {
        id: 6,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
      {
        id: 7,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
      {
        id: 8,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
      {
        id: 9,
        index: 1,
        name: 'Namvv',
        phone: '09265125',
        address: '52 Hoàng Diệu',
        city: 'TP. HCM',
        district: 'Quận 2',
        basis: 'Cơ sở quận 2',
        age: 25,
        status: 'Lead mới',
        tags: 'Quan tâm học phí ',
        staff: 'Nguyễn Thị B',
        search: 'Data MKT',
      },
    ],
    branches: [
      {
        id: 1,
        name: 'Nguyễn Văn Nam',
      },
      {
        id: 2,
        name: 'Nguyễn Văn',
      },
    ],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({
      ...state,
      isError: false,
      data: [],
    }),
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
  },
  effects: {},
  subscriptions: {},
};
