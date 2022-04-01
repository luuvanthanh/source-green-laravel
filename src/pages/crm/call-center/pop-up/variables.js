const variablesModule = {
  STATUS: {
    idle: 'IDLE',
    inbound: 'INBOUND',
    outbound: 'OUTBOUND',

    accepted: 'ACCEPTED',
    rejected: 'REJECTED',
    cancel: 'CANCEL',
    bye: 'BYE',
    failed: 'FAILED',
    unavailable: 'UNAVAILABLE',
    not_found: 'NOTFOUND',
    track_added: 'TRACK_ADDED',
  },

  SOCKET_STATUS: {
    originator_cancel: 'ORIGINATOR_CANCEL',
  },
};

export default variablesModule;
