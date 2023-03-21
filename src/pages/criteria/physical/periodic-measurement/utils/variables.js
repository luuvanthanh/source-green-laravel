import ability from '@/utils/ability';

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
    ...(ability.can(
      'WEB_THECHAT_DOLUONGDINHKY_CHUADOLUONG_VIEW',
      'WEB_THECHAT_DOLUONGDINHKY_CHUADOLUONG_VIEW',
    )
      ? [
          {
            id: 'NOT_MEASURED',
            name: 'CHƯA ĐO LƯỜNG',
            type: 'totalOfNoCriteria',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_THECHAT_DOLUONGDINHKY_DADOLUONG_VIEW',
      'WEB_THECHAT_DOLUONGDINHKY_DADOLUONG_VIEW',
    )
      ? [
          {
            id: 'MEASURED',
            name: 'ĐÃ ĐO LƯỜNG',
            type: 'totalOfHasCriteria',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_THECHAT_DOLUONGDINHKY_CHUADUYET_VIEW',
      'WEB_THECHAT_DOLUONGDINHKY_CHUADUYET_VIEW',
    )
      ? [
          {
            id: 'NOT_APPROVED',
            name: 'CHƯA DUYỆT',
            type: 'totalOfNoApprove',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_THECHAT_DOLUONGDINHKY_DADUYET_VIEW',
      'WEB_THECHAT_DOLUONGDINHKY_DADUYET_VIEW',
    )
      ? [
          {
            id: 'APPROVED',
            name: 'ĐÃ DUYỆT',
            type: 'totalOfHasApprove',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_THECHAT_DOLUONGDINHKY_CHUAGUI_VIEW',
      'WEB_THECHAT_DOLUONGDINHKY_CHUAGUI_VIEW',
    )
      ? [
          {
            id: 'NOT_SEND',
            name: 'CHƯA GỬI',
            type: 'totalOfNoSend',
          },
        ]
      : []),
    ...(ability.can('WEB_THECHAT_DOLUONGDINHKY_DAGUI_VIEW', 'WEB_THECHAT_DOLUONGDINHKY_DAGUI_VIEW')
      ? [
          {
            id: 'SEND',
            name: 'ĐÃ GỬI',
            type: 'totalOfHasSend',
          },
        ]
      : []),
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
