
export default {
  namespace: 'currencyPaymentPlan',
  state: {
    data: [
      {
        id: 1,
        code: 'HS0001',
        name: 'Nguyễn Văn A',
        basic : 'Lake view',
        Grade: 'Preschool',
        class: 'Preschool 2',
        year: '2021 - 2022',
        detail: 'Học phí, tiền ăn',
      },
      {
        id: 2,
        code: 'HS0002',
        name: 'Nguyễn Văn A',
        basic : 'Lake view',
        Grade: 'Preschool',
        class: 'Preschool 2',
        year: '2021 - 2022',
        detail: 'Học phí, tiền ăn',
      },
      {
        id: 3,
        code: 'HS0003',
        name: 'Nguyễn Văn A',
        basic : 'Lake view',
        Grade: 'Preschool',
        class: 'Preschool 2',
        year: '2021 - 2022',
        detail: 'Học phí, tiền ăn',
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
