let config;
let ua;
let session;
const SESSION_STATUS = {
  IDLE: 9,
  OUTBOUND_STARTING: 1,
  OUTBOUND_RINGING: 2,
  INBOUND_RINGING: 4,
  ANSWERING: 12,
};

function waitingForApplyingAnswer(response) {
  let i = 1;
  let clearTimer;

  setTimeout(function check() {
    i++;
    clearTimer = setTimeout(check, 10);
    if (session.hasAnswer || i > 14) {
      if (session.hasAnswer) {
        clearTimeout(clearTimer);
      } else if (i === 15) {
        clearTimeout(clearTimer);
        session.sessionDescriptionHandler.setDescription(response.body).catch((error) => {
          session.logger.warn(error);
          session.failed(response, C.causes.BAD_MEDIA_DESCRIPTION);
          session.terminate({
            statusCode: 488,
            reason_phrase: 'Bad Media Description',
          });
        });
      }
    }
  }, 10);
}

export const handlePageLoad = (username, password, hostname, port, path, player) => {
  config = {
    displayName: username,
    uri: `sip:${username}@${hostname}`,
    transportOptions: { wsServers: [`wss://${hostname}:${port}${path}`] },
    authorizationUsersip: username,
    password,
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: true,
        video: false,
      },
    },
  };

  ua = new SIP.UA(config);

  ua.on('connected', () => {
    console.log('Connected (Unregistered)');
  });

  ua.on('registered', () => {
    console.log('Connected (Registered)');
  });

  ua.on('unregistered', () => {
    console.log('Connected (Unregistered)');
  });

  ua.on('error', (error) => {
    console.log('ERROR', error);
  });

  ua.on('invite', (s) => {
    session = s;
    console.log(s);
    session.type = 'inbound';

    session.on('accepted', () => {
      console.log('ACCEPTED');
    });
    session.on('rejected', () => {
      console.log('REJECTED');
    });
    session.on('cancel', () => {
      console.log('CANCEL');
    });
    session.on('failed', () => {
      console.log('FAILED');
    });
    session.on('bye', () => {
      console.log('BYE');
    });

    console.log(session);
    session.on('trackAdded', () => {
      console.log('TRACK_ADDED');
      const pc = session.sessionDescriptionHandler.peerConnection;
      const remoteStream = new MediaStream();
      pc.getReceivers().forEach((receiver) => {
        remoteStream.addTrack(receiver.track);
      });
      if (typeof player.srcObject !== 'undefined') {
        player.srcObject = remoteStream;
      } else if (typeof player.mozSrcObject !== 'undefined') {
        player.mozSrcObject = remoteStream;
      } else if (typeof player.src !== 'undefined') {
        player.src = URL.createObjectURL(remoteStream);
      } else {
        console.log('Error attaching stream to element.');
      }
      player.play();
    });
  });
};

export const handleButtonCallClick = (phoneNumber, player) => {
  let status = SESSION_STATUS.IDLE;
  if (session) {
    status = session.status;
  }
  if (status === SESSION_STATUS.IDLE) {
    session = ua.invite(phoneNumber, {
      media: {
        constraints: {
          audio: true,
          video: false,
        },
      },
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false,
        },
      },
    });
    session.type = 'outbound';
    session.on('progress', (response) => {
      if (response.statusCode === 183 && response.body && session.hasOffer && !session.dialog) {
        if (
          !response.hasHeader('require') ||
          response.getHeader('require').indexOf('100rel') === -1
        ) {
          if (
            session.sessionDescriptionHandler.hasDescription(response.getHeader('Content-Type'))
          ) {
            // @hack: https://github.com/onsip/SIP.js/issues/242
            session.status = SIP.Session.C.STATUS_EARLY_MEDIA;
            waitingForApplyingAnswer(response);
          }
        }
      }
    });
    // showAnswerCallElements();

    session.on('accepted', () => {
      console.log('ACCEPTED');
      // showAnswerCallElements();
    });
    session.on('rejected', () => {
      console.log('REJECTED');
      // showIdleCallElements();
    });
    session.on('cancel', () => {
      console.log('CANCEL');
      // showIdleCallElements();
    });
    session.on('failed', (req) => {
      switch (req.reasonPhrase) {
        case 'Busy Here':
          return console.log('Máy bận');
        case 'Not Found':
          return console.log('số không tồn tại');
        default:
          break;
      }
      console.log('FAILED');
      // showIdleCallElements();
    });
    session.on('bye', () => {
      console.log('BYE');
      // showIdleCallElements();
    });

    session.on('unavailable', () => {
      console.log('UNAVAILABLE');
    });

    session.on('not found', () => {
      console.log('NOT_FOUND');
    });
    session.on('trackAdded', () => {
      console.log('TRACK_ADDED');
      const pc = session.sessionDescriptionHandler.peerConnection;
      const remoteStream = new MediaStream();

      pc.getReceivers().forEach((receiver) => {
        remoteStream.addTrack(receiver.track);
      });

      if (typeof player.srcObject !== 'undefined') {
        player.srcObject = remoteStream;
      } else if (typeof player.mozSrcObject !== 'undefined') {
        player.mozSrcObject = remoteStream;
      } else if (typeof player.src !== 'undefined') {
        player.src = URL.createObjectURL(remoteStream);
      } else {
        console.log('Error attaching stream to element.');
      }
      player.play();
    });
  }
};

export const handleButtonHangupClick = () => {
  session.terminate();
};

export const handleButtonRejectClick = () => {
  session.reject();
};

export function handleButtonAnswerClick() {
  const option = {
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: true,
        video: false,
      },
    },
  };
  session.accept(option);
}
