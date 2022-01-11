
export default {
  namespace: 'currencyRevenueExpenditure',
  state: {
    data: [
      {
        id: 1,
        code: 'HS0001',
        nameStudent: 'Nguyễn Văn A',
        basic : 'Lake view',
        class: 'Preschool 2',
        Beginning: '10.000.000',
        revenueInThePeriod: '10.000.000',
        Collected: '5.000.000',
        Done: '1.000.000',
        Remaining: '14.000.000',
      },
      {
        id: 2,
        code: 'HS0001',
        nameStudent: 'Nguyễn Văn A',
        basic : 'Lake view',
        class: 'Preschool 2',
        Beginning: '10.000.000',
        revenueInThePeriod: '10.000.000',
        Collected: '5.000.000',
        Done: '1.000.000',
        Remaining: '14.000.000',
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
  },
  effects: {
  },
  subscriptions: {},
};