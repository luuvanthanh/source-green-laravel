import { useCallback, useState } from 'react';
import { Session, UA, C } from 'sip.js';
import { useDispatch } from 'dva';
import { isEmpty } from 'lodash';

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

const handleInboundCall = () => {
  const [inboundStatus, setInboundStatus] = useState('');
  const [infoCall, setInfoCall] = useState({});

  const inboundContext = useCallback((username, password, hostname, port, path, playerRef) => {
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

      const sound = new Audio('/resources/skype-ringtones.mp3');
      sound.loop = true;
      const soundPromise = sound.play();

      const soundPlay = () => {
        if (soundPromise !== undefined) {
          soundPromise
            .then(() => {
              sound.play();
            })
            .catch(() => {});
        }
      };

      const soundStop = () => {
        if (soundPromise !== undefined) {
          soundPromise
            .then(() => {
              sound.pause();
              sound.currentTime = 0;
            })
            .catch(() => {});
        }
      };

      soundPlay();

      session.on('accepted', () => {
        setInboundStatus('ACCEPTED');
        soundStop();
        console.log('%cĐỒNG Ý (GỌI ĐẾN)', 'color: #2ecc71; font-weight: bold');
      });
      session.on('rejected', () => {
        setInboundStatus('REJECTED');
        soundStop();
        console.log('%cTỪ CHỐI (GỌI ĐẾN)', 'color: pink; font-weight: bold');
      });
      session.on('cancel', () => {
        setInboundStatus('CANCEL');
        soundStop();
        console.log('%cHUỶ (GỌI ĐẾN)', 'color: pink; font-weight: bold');
      });
      session.on('failed', () => {
        setInboundStatus('FAILED');
        soundStop();
        console.log('%cTHẤT BẠI (GỌI ĐẾN)', 'color: pink; font-weight: bold');
      });
      session.on('bye', () => {
        setInboundStatus('BYE');
        soundStop();
        console.log('%cKẾT THÚC (GỌI ĐẾN)', 'color: red; font-weight: bold');
      });

      session.on('trackAdded', () => {
        console.log('%cTHÊM ÂM THANH (GỌI ĐẾN)', 'color: yellow; font-weight: bold');

        const remoteStream = new MediaStream();
        session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
          if (receiver.track) {
            remoteStream.addTrack(receiver.track);
          }
        });
        player.srcObject = remoteStream;
        const playPromise = player.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {}).catch(() => {});
        }
      });

      // session.on('refer', (target) => {
      //   session.bye();
      //   console.log('target', target);
      //   console.log('%cCHUYỂN TIẾP', 'color: yellow; font-weight: bold');
      //   // createNewSessionUI(
      //   //   target,
      //   //   ua.invite(target, {
      //   //     mediaConstraints: {
      //   //       audio: true,
      //   //       video: false,
      //   //     },
      //   //   }),
      //   // );
      // });

      setInfoCall(session);
    });
  }, []);

  return { inboundStatus, infoCall, inboundContext };
};

const handleOutboundCall = () => {
  const [outboundStatus, setOutboundStatus] = useState('');
  const dispatch = useDispatch();

  const outboundContext = useCallback((phoneNumber, playerRef) => {
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
        setOutboundStatus('ACCEPTED');
      });
      session.on('rejected', () => {
        console.log('%cTỪ CHỐI (GỌI ĐI)', 'color: pink; font-weight: bold');
        setOutboundStatus('REJECTED');
      });
      session.on('cancel', () => {
        console.log('%cHUỶ (GỌI ĐI)', 'color: pink; font-weight: bold');
        setOutboundStatus('CANCEL');
      });
      session.on('failed', () => {
        console.log('%cTHẤT BẠI (GỌI ĐI)', 'color: pink; font-weight: bold');
        setOutboundStatus('FAILED');
      });
      session.on('bye', (response) => {
        if (!isEmpty(response)) {
          dispatch({
            type: 'crmManagementCall/OUTBOUND_HISTORY',
            payload: {
              outboundHistory: response,
            },
          });
        }
        console.log('%cKẾT THÚC (GỌI ĐI)', 'color: red; font-weight: bold');
        setOutboundStatus('BYE');
      });
      session.on('unavailable', () => {
        setOutboundStatus('UNAVAILABLE');
      });
      session.on('not found', () => {
        setOutboundStatus('NOT_FOUND');
      });
      session.on('trackAdded', () => {
        console.log('%cTHÊM ÂM THANH (GỌI ĐI)', 'color: yellow; font-weight: bold');
        setOutboundStatus('TRACK_ADDED');

        const remoteStream = new MediaStream();
        session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
          if (receiver.track) {
            remoteStream.addTrack(receiver.track);
          }
        });
        player.srcObject = remoteStream;
        const playPromise = player.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {}).catch(() => {});
        }
      });
    }
  }, []);

  return { outboundStatus, outboundContext };
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

const handleTransfer = (
  username = 23389,
  password = 'crm@cmc2018',
  hostname = 'kam-01.api-connect.io',
  port = 7443,
  path = '',
) => {
  session.hold();
  const configTransfer = {
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
  // const newOptions = {
  //   inviteWithoutSdp: true,
  //   rel100: C.supported.SUPPORTED,
  //   activeAfterTransfer: false,
  // };
  if (session && session.status === SESSION_STATUS.ANSWERING) {
    const uaTransfer = new UA(configTransfer);
    // const replacementSession = ua.invite(uaTransfer);
    console.log(ua, uaTransfer);
    // session.refer(replacementSession);
    // session.refer(sessionTwo);
  }
};

const stopSession = () => {
  if (ua?.isRegistered()) {
    ua?.unregister();
  }
};

export {
  handleInboundCall,
  handleOutboundCall,
  handleHangup,
  handleAnswer,
  handleReject,
  handleTransfer,
  stopSession,
};
