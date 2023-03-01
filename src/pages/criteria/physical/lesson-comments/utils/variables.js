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
      name: 'CHƯA NHẬN XÉT',
      keySummary: 'totalOfNoFeedback'
    },
    {
      id: 'DID_FEEDBACK',
      name: 'ĐÃ NHẬN XÉT',
      keySummary: 'totalOfHasFeedback'
    },
    {
      id: 'NOT_APPROVED_FEEDBACK',
      name: 'CHƯA DUYỆT',
      keySummary: 'totalOfNoApprove'
    },
    {
      id: 'APPROVED_FEEDBACK',
      name: 'ĐÃ DUYỆT',
      keySummary: 'totalOfHasApprove'
    },
  ]
};

export default variables;
