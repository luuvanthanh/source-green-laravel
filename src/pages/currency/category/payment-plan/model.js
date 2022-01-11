
export default {
  namespace: 'currencyPaymentPlan',
  state: {
    data: [
      {
        id: 1,
        date: '01/08/2021',
        year: '2021 - 2022',
        month : 'Tháng 8',
        basic: 'Lake View',
        class: 'Preschool 2',
        status: 'Chưa gửi',
      },
      {
        id: 2,
        date: '01/08/2021',
        year: '2021 - 2022',
        month : 'Tháng 8',
        basic: 'Lake View',
        class: 'Preschool 1',
        status: 'Chưa gửi',
      },
      {
        id: 3,
        date: '01/08/2021',
        year: '2021 - 2022',
        month : 'Tháng 8',
        basic: 'Lake View',
        class: 'Preschool 2',
        status: 'Đã gửi',
      },
      {
        id: 4,
        date: '01/08/2021',
        year: '2021 - 2022',
        month : 'Tháng 8',
        basic: 'Lake View',
        class: 'Preschool 2',
        status: 'Đã gửi',
      }
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
  },
  effects: {
  },
  subscriptions: {},
};
