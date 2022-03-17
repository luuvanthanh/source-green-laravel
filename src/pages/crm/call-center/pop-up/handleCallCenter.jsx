import { useCallback, useEffect, useState } from 'react';

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

const handlePageLoad = (username, password, hostname, port, path, playerRef) => {
  const player = playerRef;
  const [sessionStatus, setSessionStatus] = useState('');
  const [infoCall, setInfoCall] = useState({});

  useEffect(() => {
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
      console.log('%cCONNECTED', 'color: green; font-weight: bold');
    });
    ua.on('registered', () => {
      console.log('%cREGISTERED', 'color: green; font-weight: bold');
    });
    ua.on('unregistered', () => {
      console.log('%cUNREGISTERED', 'color: green; font-weight: bold');
    });
    ua.on('error', () => {
      console.log('%cERROR', 'color: red; font-weight: bold');
    });

    ua.on('invite', (s) => {
      session = s;
      session.type = 'inbound';

      session.on('accepted', () => {
        setSessionStatus('ACCEPTED');
        console.log('%cACCEPTED', 'color: green; font-weight: bold');
      });
      session.on('rejected', () => {
        setSessionStatus('REJECTED');
        console.log('%cREJECTED', 'color: pink; font-weight: bold');
      });
      session.on('cancel', () => {
        setSessionStatus('CANCEL');
        console.log('%cREJECTED', 'color: pink; font-weight: bold');
      });
      session.on('failed', () => {
        setSessionStatus('FAILED');
        console.log('%cREJECTED', 'color: pink; font-weight: bold');
      });
      session.on('bye', () => {
        setSessionStatus('BYE');
        console.log('%cBYE', 'color: red; font-weight: bold');
      });

      session.on('trackAdded', () => {
        console.log('%cTRACK', 'color: yellow; font-weight: bold');
        const pc = session.sessionDescriptionHandler.peerConnection;
        const remoteStream = new MediaStream();

        pc.getReceivers().forEach((receiver) => {
          remoteStream.addTrack(receiver.track);
        });

        if (typeof player?.srcObject !== 'undefined') {
          player.srcObject = remoteStream;
        } else if (typeof player?.mozSrcObject !== 'undefined') {
          player.mozSrcObject = remoteStream;
        } else if (typeof player?.src !== 'undefined') {
          player.src = URL.createObjectURL(remoteStream);
        }
        player?.play();
      });

      setInfoCall(session);
    });
  }, []);

  return { sessionStatus, infoCall };
};

const handleCallClick = () => {
  const [clientStatus, setClientStatus] = useState('');

  const performCall = useCallback((phoneNumber, playerRef) => {
    const player = playerRef;
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
              session.status = SIP.Session.C.STATUS_EARLY_MEDIA;
              waitingForApplyingAnswer(response);
            }
          }
        }
      });

      session.on('accepted', () => {
        console.log('%cACCEPTED', 'color: green; font-weight: bold');
        setClientStatus('ACCEPTED');
      });
      session.on('rejected', () => {
        console.log('%cREJECTED', 'color: pink; font-weight: bold');
        setClientStatus('REJECTED');
      });
      session.on('cancel', () => {
        console.log('%cCANCEL', 'color: pink; font-weight: bold');
        setClientStatus('CANCEL');
      });
      session.on('failed', () => {
        console.log('%cFAILED', 'color: pink; font-weight: bold');
        setClientStatus('FAILED');
      });
      session.on('bye', () => {
        console.log('%cBYE', 'color: red; font-weight: bold');
        setClientStatus('BYE');
      });
      session.on('unavailable', () => {
        setClientStatus('UNAVAILABLE');
      });
      session.on('not found', () => {
        setClientStatus('NOT_FOUND');
      });
      session.on('trackAdded', () => {
        console.log('%cTRACK', 'color: yellow; font-weight: bold');
        const pc = session.sessionDescriptionHandler.peerConnection;
        const remoteStream = new MediaStream();

        pc.getReceivers().forEach((receiver) => {
          remoteStream.addTrack(receiver.track);
        });

        if (typeof player?.srcObject !== 'undefined') {
          player.srcObject = remoteStream;
        } else if (typeof player?.mozSrcObject !== 'undefined') {
          player.mozSrcObject = remoteStream;
        } else if (typeof player?.src !== 'undefined') {
          player.src = URL.createObjectURL(remoteStream);
        }
        player?.play();
      });
    }
  }, []);

  return [clientStatus, performCall];
};

const handleHangup = () => {
  session.terminate();
};

const handleAnswer = () => {
  const option = {
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: true,
        video: false,
      },
    },
  };
  session.accept(option);
};

const handleReject = () => {
  const option = {
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: false,
        video: false,
      },
    },
  };
  session.reject(option);
};

export { handlePageLoad, handleCallClick, handleHangup, handleAnswer, handleReject };
