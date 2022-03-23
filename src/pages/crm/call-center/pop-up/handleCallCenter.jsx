import { useCallback, useState } from 'react';
import { Session, UA, C } from 'sip.js';

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
    i += 1;
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

const handleOnServer = () => {
  const [serverStatus, setServerStatus] = useState('');
  const [infoCall, setInfoCall] = useState({});

  const serverContext = useCallback((username, password, hostname, port, path, playerRef) => {
    const player = playerRef;
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

    ua = new UA(config);

    ua.on('connected', () => {
      console.log('%cĐÃ KẾT NỐI (CHƯA ĐĂNG KÝ)', 'color: #2ecc71; font-weight: bold');
    });
    ua.on('registered', () => {
      console.log('%cĐÃ KẾT NỐI (ĐĂNG KÝ)', 'color: #2ecc71; font-weight: bold');
    });
    ua.on('unregistered', () => {
      console.log('%cCHƯA ĐĂNG KÝ', 'color: #2ecc71; font-weight: bold');
    });
    ua.on('error', () => {
      console.log('%cERROR', 'color: red; font-weight: bold');
    });

    ua.on('invite', (s) => {
      session = s;
      session.type = 'inbound';

      session.on('accepted', () => {
        setServerStatus('ACCEPTED');
        console.log('%cĐỒNG Ý (GỌI ĐẾN)', 'color: #2ecc71; font-weight: bold');
      });
      session.on('rejected', () => {
        setServerStatus('REJECTED');
        console.log('%cTỪ CHỐI (GỌI ĐẾN)', 'color: pink; font-weight: bold');
      });
      session.on('cancel', () => {
        setServerStatus('CANCEL');
        console.log('%cHUỶ (GỌI ĐẾN)', 'color: pink; font-weight: bold');
      });
      session.on('failed', () => {
        setServerStatus('FAILED');
        console.log('%cTHẤT BẠI (GỌI ĐẾN)', 'color: pink; font-weight: bold');
      });
      session.on('bye', () => {
        setServerStatus('BYE');
        console.log('%cKẾT THÚC (GỌI ĐẾN)', 'color: red; font-weight: bold');
      });

      session.on('trackAdded', () => {
        console.log('%cTHÊM ÂM THANH (GỌI ĐẾN)', 'color: yellow; font-weight: bold');
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
        }
        player.play();
      });

      setInfoCall(session);
    });
  }, []);

  return { serverStatus, infoCall, serverContext };
};

const handleOnClient = () => {
  const [clientStatus, setClientStatus] = useState('');

  const clientContext = useCallback((phoneNumber, playerRef) => {
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
              session.status = Session.C.STATUS_EARLY_MEDIA;
              waitingForApplyingAnswer(response);
            }
          }
        }
      });

      session.on('accepted', () => {
        console.log('%cĐỒNG Ý (GỌI ĐI)', 'color: #2ecc71; font-weight: bold');
        setClientStatus('ACCEPTED');
      });
      session.on('rejected', () => {
        console.log('%cTỪ CHỐI (GỌI ĐI)', 'color: pink; font-weight: bold');
        setClientStatus('REJECTED');
      });
      session.on('cancel', () => {
        console.log('%cHUỶ (GỌI ĐI)', 'color: pink; font-weight: bold');
        setClientStatus('CANCEL');
      });
      session.on('failed', () => {
        console.log('%cTHẤT BẠI (GỌI ĐI)', 'color: pink; font-weight: bold');
        setClientStatus('FAILED');
      });
      session.on('bye', () => {
        console.log('%cKẾT THÚC (GỌI ĐI)', 'color: red; font-weight: bold');
        setClientStatus('BYE');
      });
      session.on('unavailable', () => {
        setClientStatus('UNAVAILABLE');
      });
      session.on('not found', () => {
        setClientStatus('NOT_FOUND');
      });
      session.on('trackAdded', () => {
        console.log('%cTHÊM ÂM THANH (GỌI ĐI)', 'color: yellow; font-weight: bold');
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
        }
        player.play();
      });
    }
  }, []);

  return { clientStatus, clientContext };
};

const handleHangup = () => {
  session.terminate();
};

const handleAnswer = () => {
  session.accept({
    statusCode: 202,
    reasonPhrase: 'Accepted',
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: true,
        video: false,
      },
    },
  });
};

const handleReject = () => {
  session.reject({
    statusCode: 603,
    reasonPhrase: 'Decline',
  });
};

export { handleOnServer, handleOnClient, handleHangup, handleAnswer, handleReject };
