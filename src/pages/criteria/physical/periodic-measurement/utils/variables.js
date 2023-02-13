// import ability from '@/utils/ability';

export const variables = {
  STATUS: {
    NOT_MEASURED: 'NOT_MEASURED',
    MEASURED: 'MEASURED',
    NOT_APPROVED: 'NOT_APPROVED',
    APPROVED: 'APPROVED',
  },
  STATUS_TABS: [
    {
      id: 'NOT_MEASURED',
      name: 'CHƯA ĐO LƯỜNG',
      type: 'quantityNotYetReview',
    },
    {
      id: 'MEASURED',
      name: 'ĐÃ ĐO LƯỜNG',
      type: 'quantityDoneReview',
    },
    {
      id: 'NOT_APPROVED',
      name: 'CHƯA DUYỆT',
      type: 'quantityNotYetConfirm',
    },
    {
      id: 'APPROVED',
      name: 'ĐÃ DUYỆT',
      type: 'quantityDoneConfirm',
    },
    {
      id: 'NOT_SEND',
      name: 'CHƯA GỬI',
      type: 'quantityNotYetConfirm',
    },
    {
      id: 'SEND',
      name: 'ĐÃ GỬI',
      type: 'quantityDoneConfirm',
    },
  ],
  STATUS_SEARCH: {
    MEASURED: 'DID_CRITERIA',
    NOT_APPROVED: 'DID_CRITERIA',
    APPROVED: 'APPROVED_CRITERIA',
  },
};

export default variables;
