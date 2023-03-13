export const variables = {
  STATUS: {
    PENDING_APPROVED: 'PENDING_APPROVED',
    APPROVED: 'APPROVED',
    NOT_SEND: 'NOT_SEND',
    SEND: 'SEND',
  },
  STATUS_NAME: {
    NOT_SEND: 'Chưa gửi',
    SEND: 'Đã gửi',
  },
  STATUS_TABS: [
    {
      id: 'PENDING_APPROVED',
      name: 'Chờ gửi',
      type: 'not_send',
    },
    {
      id: 'APPROVED',
      name: 'Đã gửi',
      type: 'send',
    },
  ],
};

export default variables;
