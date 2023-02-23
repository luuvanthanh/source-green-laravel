export const variables = {
  STATUS: {
    NOT_FEEDBACK: 'NOT_FEEDBACK',
    DID_FEEDBACK: 'DID_FEEDBACK',
    NOT_APPROVED_FEEDBACK: 'NOT_APPROVED_FEEDBACK',
    APPROVED_FEEDBACK: 'APPROVED_FEEDBACK'
  },
  NAME_ROLES: {
    TEACHER: 'Giáo viên',
    PARENT: 'Phụ huynh',
  },
  STATUS_TABS_REVIEWS: [
    {
      id: 'NOT_FEEDBACK',
      name: 'Chưa nhận xét',
    },
    {
      id: 'DID_FEEDBACK',
      name: 'Đã nhận xét',
    },
    {
      id: 'NOT_APPROVED_FEEDBACK',
      name: 'Chưa duyệt',
    },
    {
      id: 'APPROVED_FEEDBACK',
      name: 'Đã duyệt',
    },
  ]
};

export default variables;
