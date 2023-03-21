import ability from '@/utils/ability';

export const variables = {
  STATUS: {
    NOT_FEEDBACK: 'NOT_FEEDBACK',
    DID_FEEDBACK: 'DID_FEEDBACK',
    NOT_APPROVED_FEEDBACK: 'NOT_APPROVED_FEEDBACK',
    APPROVED_FEEDBACK: 'APPROVED_FEEDBACK',
  },
  NAME_ROLES: {
    TEACHER: 'Giáo viên',
    PARENT: 'Phụ huynh',
  },
  STATUS_TABS_REVIEWS: [
    ...(ability.can(
      'WEB_THECHAT_NHANXETTIETHOC_CHUANHANXET_VIEW',
      'WEB_THECHAT_NHANXETTIETHOC_CHUANHANXET_VIEW',
    )
      ? [
          {
            id: 'NOT_FEEDBACK',
            name: 'CHƯA NHẬN XÉT',
            keySummary: 'totalOfNoFeedback',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_THECHAT_NHANXETTIETHOC_DANHANXET_VIEW',
      'WEB_THECHAT_NHANXETTIETHOC_DANHANXET_VIEW',
    )
      ? [
          {
            id: 'DID_FEEDBACK',
            name: 'ĐÃ NHẬN XÉT',
            keySummary: 'totalOfHasFeedback',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_THECHAT_NHANXETTIETHOC_CHUADUYET_VIEW',
      'WEB_THECHAT_NHANXETTIETHOC_CHUADUYET_VIEW',
    )
      ? [
          {
            id: 'NOT_APPROVED_FEEDBACK',
            name: 'CHƯA DUYỆT',
            keySummary: 'totalOfNoApprove',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_THECHAT_NHANXETTIETHOC_DADUYET_VIEW',
      'WEB_THECHAT_NHANXETTIETHOC_DADUYET_VIEW',
    )
      ? [
          {
            id: 'APPROVED_FEEDBACK',
            name: 'ĐÃ DUYỆT',
            keySummary: 'totalOfHasApprove',
          },
        ]
      : []),
  ],
};

export default variables;
