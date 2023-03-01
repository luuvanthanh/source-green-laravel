// import ability from '@/utils/ability';

export const variables = {
  STATUS: {
    NOT_MEASURED: 'NOT_MEASURED',
    MEASURED: 'MEASURED',
    NOT_APPROVED: 'NOT_APPROVED',
    APPROVED: 'APPROVED',
    NOT_SEND: 'NOT_SEND',
    SEND: 'SEND',
  },
  STATUS_TABS: [
    {
      id: 'NOT_MEASURED',
      name: 'CHƯA ĐO LƯỜNG',
      type: 'totalOfNoCriteria',
    },
    {
      id: 'MEASURED',
      name: 'ĐÃ ĐO LƯỜNG',
      type: 'totalOfHasCriteria',
    },
    {
      id: 'NOT_APPROVED',
      name: 'CHƯA DUYỆT',
      type: 'totalOfNoApprove',
    },
    {
      id: 'APPROVED',
      name: 'ĐÃ DUYỆT',
      type: 'totalOfHasApprove',
    },
    {
      id: 'NOT_SEND',
      name: 'CHƯA GỬI',
      type: 'totalOfNoSend',
    },
    {
      id: 'SEND',
      name: 'ĐÃ GỬI',
      type: 'totalOfHasSend',
    },
  ],
  STATUS_SEARCH: {
    MEASURED: 'DID_CRITERIA',
    NOT_APPROVED: 'DID_CRITERIA',
    APPROVED: 'APPROVED_CRITERIA',
    NOT_SEND: 'APPROVED_CRITERIA',
    SEND: 'SENT_CRITERIA',
  },
  STATUS_BMI: {
    UNDERWEIGHT: 'thiếu cân',
    OVERWEIGHT: 'thừa cân',
    OBESITY: 'thừa cân',
    NORMAL: 'bình thường',
  },

  STATUS_COLOR: {
    UNDERWEIGHT: '#AE1818',
    OVERWEIGHT: '#AE1818',
    OBESITY: '#AE1818',
    NORMAL: '#27A600',
  },
};

export default variables;
