
export default {
  namespace: 'currencyNewStudent',
  state: {
    data: [
      {
        id: 1,
        year: '2021 - 2022',
        nameStudent: 'Lê Văn A  ',
        birthDay : '23/11/2019',
        age: '28',
        dayAdmission: '01/09/2021',
        fatherName: 'Lê Văn B',
        fatherPhone: '0932555333',
        monName: 'Nguyễn Thị C',
        monPhone: '0932555251',
        total: '128,300,000',
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