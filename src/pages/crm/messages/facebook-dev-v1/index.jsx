import { memo, useEffect, useState, useRef } from 'react';
import { Input, Skeleton, Tag, Select, Image, Upload, Form, Divider, Space, Checkbox } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import FormItem from '@/components/CommonComponent/FormItem';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import { head, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Text from '@/components/CommonComponent/Text';
import { variables, Helper } from '@/utils';
import InfiniteScroll from 'react-infinite-scroller';
import Button from '@/components/CommonComponent/Button';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import MultipleImageUpload from './UploadAvatar';
import styles from './styles.module.scss';


const sex = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
  // { id: 'OTHER', name: 'Khác' },
];
const { Option } = Select;
const Index = memo(() => {
  const scrollbars = useRef();

  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const [{ user, tags, relationships, employeeFB, conversationsId ,token}] = useSelector(({ crmFBDevV1, loading: { effects } }) => [
    crmFBDevV1,
    effects,
  ]);
  //note
  const [detailLead, setDetailLead] = useState(undefined);
  const [noteValue, setNoteValue] = useState([]);
  const [noteModal, setNoteModal] = useState(false);
  const [dayOfBirth, setDayOfBirth] = useState(null);

  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(undefined);
  const [isAction, setIsAction] = useState(false);
  const [pageCurrent, setPageCurrent] = useState([]);
  const [page, setPage] = useState([]);
  const [pageID, setPageID] = useState([]);
  const [conversationCurrent, setConversationCurrent] = useState({});
  const [users, setUsers] = useState([]);
  const [messagers, setMessagers] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageFile, setMessageFile] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [loadingMessageUser, setLoadingMessageUser] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectEmployee, setSelectEmployee] = useState(undefined);
  const [search, setSearch] = useState(null);

  //search
  const [modalTag, setModalTag] = useState(false);
  const [modalUser, setModalUser] = useState(false);
  const [searchData, setSearchData] = useState(false);
  const [searchE, setSearchE] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [checkbox, setCheckBox] = useState([]);
  const [checkboxUser, setCheckBoxUser] = useState([]);
  const [notiInbox, setNotiInbox] = useState(false);
  const [notReply, setNotReply] = useState(false);
  const [checkPhone, setCheckPhone] = useState(false);
  const [checkNotPhone, setCheckNotPhone] = useState(false);


  const [searchParent, setSearchParent] = useState({
    page: 1,
    limit: 10,
    total: 1,
    hasMore: true,
    loading: false,
  });

  const [searchUser, setSearchUser] = useState({
    page: 1,
    limit: 10,
    total: 1,
    hasMore: true,
    loading: false,
  });

  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const responseFacebook = (response) => {
    if (response.userID) {
      dispatch({
        type: 'crmFBDevV1/GET_USER',
        payload: response,
      });
    }
  };

  useEffect(() => {
    if (user?.userID) {
      dispatch({
        type: 'crmFBDevV1/GET_PAGES',
        payload: {
          user_access_token: user?.accessToken,
          user_id: user?.userID,
        },
        callback: (response) => {
          if (response) {
            setPageCurrent(response.data);
          }
        },
      });
    }
  }, [user?.userID]);

  useEffect(() => {
    if (pageCurrent.length > 0) {
      dispatch({
        type: 'crmFBDevV1/ADD_CONVERSATIONS',
        payload: { data_page: pageCurrent?.map(i => ({ page_access_token: i?.access_token, page_id: i?.id })), },
        callback: () => { }
      });
      dispatch({
        type: 'crmFBDevV1/ADD_EMPLOYEE',
        payload: { data_page: pageCurrent?.map(i => ({ page_access_token: i?.access_token, page_id: i?.id })), },
        callback: () => { }
      });
      dispatch({
        type: 'crmFBDevV1/GET_PAGESDB',
        payload: { page_id_facebook: (pageCurrent.map(i => i.id).join(',')) },
        callback: (response) => {
          if (response) {
            setPage(response.data);
            setPageID([response.data[0]]);
          }
        },
      });
    }
  }, [pageCurrent.length]);
  useEffect(() => {
    const pageId = page?.find(i => i?.id === pageID[0]?.id);
    if (pageId) {
      dispatch({
        type: 'crmFBDevV1/GET_EMPLOYEE_FACEBOOK',
        payload: {
          page_id: pageId?.id,
        },
      });
    }
  }, [pageID]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (pageID.length > 0) {
      const pageId = page?.find(i => i?.id === pageID[0]?.id);
      setLoadingMessageUser(true);
      mountedSet(setSearchUser, { ...searchUser, loading: true });
      dispatch({
        type: 'crmFBDevV1/GET_CONVERSATIONS',
        payload: {
          page_id: pageId?.id,
          ...searchUser,
          page: searchUser.page,
        },
        callback: (response) => {
          if (response) {
            setLoadingUser(false);
            formRef.setFieldsValue({
              data: [""]
            });
            setSelectEmployee(response?.parsePayload);
            setUsers(response?.parsePayload);
            setLoadingMessageUser(false);
            const firstUser = head(
              response?.parsePayload?.map((item) => ({
                ...item,
              })),
            );
            setConversationCurrent(firstUser);
            mountedSet(setSearchUser, { ...searchUser, total: response.pagination.total });
          }
        },
      });
      dispatch({
        type: 'crmFBDevV1/GET_TAGS',
        payload: {},
      });
      dispatch({
        type: 'crmFBDevV1/GET_RELATIONSHIPS',
        payload: {},
      });
    }
  }, [pageID.length]);

  useEffect(() => {
    if (conversationCurrent?.id) {
      setLoadingMessage(true);
      setLoadingMessageUser(true);
      setDetailLead(undefined);
      mountedSet(setSearchParent, { ...searchParent, loading: true });
      dispatch({
        type: 'crmFBDevV1/GET_MESSAGES',
        payload: {
          ...searchParent,
          page: searchParent.page,
          conversation_id: conversationCurrent?.id,
        },
        callback: (response) => {
          if (response) {
            setLoadingMessage(false);
            mountedSet(setSearchParent, { ...searchParent, total: response.meta.pagination.total });
            if (response) {
              setMessagers((prev) =>
                response.data.map(i =>
                  i, ...prev),
              );
              scrollbars.current.scrollToBottom();
              setTimeout(() => {
              }, 300);
            }
            dispatch({
              type: 'crmFBDevV1/GET_CONVERSATIONS_ID',
              payload: { conversation_id: conversationCurrent?.id, },
              callback: (response) => {
                if (response) {
                  const firstUser = head(
                    response?.parsePayload?.map((item) => ({
                      ...item,
                    })),
                  );
                  // setConversationCurrent(firstUser);
                  setSelectEmployee(firstUser);
                  setNoteValue(response?.parsePayload[0]?.userFacebookInfo?.note);
                  users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
                }
              },
            });
            setLoadingMessageUser(false);
            if (conversationCurrent?.userFacebookInfo?.status !== 'LEAD') {
              setDetailLead({});
            }
            if (conversationCurrent?.userFacebookInfo?.status === 'LEAD') {
              dispatch({
                type: 'crmFBDevV1/GET_LEAD',
                payload: conversationCurrent,
                callback: (response) => {
                  if (response) {
                    const firstUser = head(
                      response?.parsePayload?.map((item) => ({
                        ...item,
                      })),
                    );
                    setDetailLead(firstUser);
                    const potetial = firstUser?.statusLead?.map(i =>
                      i?.status === 'POTENTIAL' ? i : ""
                    ).pop();
                    if (potetial) {
                      dispatch({
                        type: 'crmFBDevV1/GET_POTENTIAL',
                        payload: firstUser?.customer_lead_id,
                      });
                    }
                  }
                },
              });
            }
          }
        },
      });
    }
  }, [conversationCurrent?.id]);

  const onPressEnter = (e) => {
    setMessage(undefined);
    if (e?.target?.value && e?.target?.value !== '' || file || files) {
      setMessagers((prev) => [
        {
          id: uuidv4(),
          attributes: {
            from: pageCurrent,
            content: e?.target?.value ? e?.target?.value : "Đang gửi file/ảnh",
            created_at: moment(),
            status_send_message: "SEND",
          },
          url: messageFile,
        },
        ...prev,
      ]);
    }
    scrollbars.current.scrollToBottom();
    mountedSet(setFiles, undefined);
    mountedSet(setFile, undefined);
    const setFilea = files?.map(i => ({ url: i }));
    const dataFile = setFilea?.concat(file);
    dispatch({
      type: 'crmFBDevV1/SEND_MESSAGES',
      payload: {
        page_access_token: pageCurrent?.find(i => i.id === pageID[0]?.attributes?.page_id_facebook)?.access_token,
        recipient_id: conversationCurrent?.userFacebookInfo?.user_id,
        page_id: pageCurrent?.find(i => i.id === pageID[0]?.attributes?.page_id_facebook)?.id,
        message: e?.target?.value,
        url_files: files && file ? dataFile?.map(i => i) : (files && !file ? setFilea?.map(i => i) : (!files && file ? file?.map(i => i) : "")),
      },
      callback: () => {
        mountedSet(setFiles, undefined);
        mountedSet(setFile, undefined);
      },
    });
  };


  useEffect(() => {
    const socket = io('https://socket-crm-dev.dn.greenglobal.vn', {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      socket.emit('subscribe', {
        channel: 'facebook',
      });
    });

    socket.on('facebook.synchronize.conversation', (event, data) => {
      console.log("data", data);
      if (data) {
        dispatch({
          type: 'crmFBDevV1/ADD_CONVERSATIONS',
          payload: { data_page: pageCurrent?.map(i => ({ page_access_token: i?.access_token, page_id: i?.id })), },
          callback: () => { }
        });
        const pageId = page?.find(i => i?.id === pageID[0]?.id);
        setLoadingMessageUser(true);
        mountedSet(setSearchUser, { ...searchUser, loading: true });
        dispatch({
          type: 'crmFBDevV1/GET_CONVERSATIONS',
          payload: {
            page_id: pageId?.id,
            ...searchUser,
            page: searchUser.page,
          },
          callback: (response) => {
            if (response) {
              setLoadingUser(false);
              formRef.setFieldsValue({
                data: [""]
              });
              setSelectEmployee(response?.parsePayload);
              users.unshift(response?.parsePayload?.find(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to));
              setLoadingMessageUser(false);
              const firstUser = head(
                response?.parsePayload?.map((item) => ({
                  ...item,
                })),
              );
              setConversationCurrent(firstUser);
              mountedSet(setSearchUser, { ...searchUser, total: response.pagination.total });
            }
          },
        });
      }
    });

    socket.on('facebook.status.send.message', (event, data) => {
      if (data) {
        dispatch({
          type: 'crmFBDevV1/GET_MESSAGES',
          payload: {
            ...searchParent,
            conversation_id: conversationCurrent?.id,
          },
          callback: (response) => {
            if (response) {
              if (response) {
                setMessagers(response.data);
                scrollbars.current.scrollToBottom();
                setTimeout(() => {
                }, 300);
              }
            }
          },
        });
      }
    });

    if (conversationCurrent?.id) {
      socket.on('facebook.message.receive', (event, data) => {
        if (data) {
          dispatch({
            type: 'crmFBDevV1/GET_CONVERSATIONSCALL',
            payload: {},
            callback: (response) => {
              if (response) {
                if ((users.findIndex(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to)) !== - 1) {
                  users.splice(users.findIndex(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to), 1);
                  users.unshift(response?.parsePayload?.find(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to));
                }
                if ((users.findIndex(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to)) === - 1) {
                  users.unshift(response?.parsePayload.find(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to));
                }
              }
            },
          });
          dispatch({
            type: 'crmFBDevV1/GET_MESSAGES',
            payload: {
              ...searchParent,
              conversation_id: conversationCurrent?.id,
            },
            callback: (response) => {
              if (response) {
                mountedSet(setSearchParent, { ...searchParent, total: response.meta.pagination.total });
                if (response) {
                  setMessagers(response.data);
                  scrollbars.current.scrollToBottom();
                  setTimeout(() => {
                  }, 300);
                }
                dispatch({
                  type: 'crmFBDevV1/GET_CONVERSATIONSID',
                  payload: { conversation_id: conversationCurrent?.id, },
                  callback: (response) => {
                    if (response) {
                      if (conversationCurrent?.userFacebookInfo?.status === 'LEAD') {
                        dispatch({
                          type: 'crmFBDevV1/GET_LEAD',
                          payload: conversationCurrent,
                          callback: (response) => {
                            if (response) {
                              const firstUser = head(
                                response?.parsePayload?.map((item) => ({
                                  ...item,
                                })),
                              );
                              setDetailLead(firstUser);
                              const potetial = firstUser?.statusLead?.map(i =>
                                i?.status === 'POTENTIAL' ? i : ""
                              ).pop();
                              if (potetial) {
                                dispatch({
                                  type: 'crmFBDevV1/GET_POTENTIAL',
                                  payload: firstUser?.customer_lead_id,
                                });
                              }
                            }
                          },
                        });
                      }
                      const firstUser = head(
                        response?.parsePayload?.map((item) => ({
                          ...item,
                        })),
                      );
                      setConversationCurrent(firstUser);
                      users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
                    }
                  },
                });

              }
            },
          });
        }
      });
    }
    return () => socket.close();
  }, [conversationCurrent?.id, user?.userID]);

  const uploadFiles = (url) => {

    mountedSet(setFiles, (prev) => prev ? [...prev, url] : [url]);
  };


  const onChangeConversation = (id) => {
    setNoteModal(false);
    setSelectEmployee(undefined);
    setConversationCurrent(users.find((item) => item.id === id));
    setSearchParent({
      page: 1,
      limit: 15,
      total: 0,
      hasMore: true,
      loading: false,
    });
  };

  const onSelectColor = (e) => {
    dispatch({
      type: 'crmFBDevV1/ADD_TAGS',
      payload: {
        user_facebook_info_tag: e.map((i) => ({ tag_id: i })),
        user_facebook_info_id: conversationCurrent?.userFacebookInfo?.id,
      },
      callback: () => {
        dispatch({
          type: 'crmFBDevV1/GET_CONVERSATIONSID',
          payload: { conversation_id: conversationCurrent.id },
          callback: (response) => {
            if (response) {
              const firstUser = head(
                response?.parsePayload?.map((item) => ({
                  ...item,
                })),
              );
              setConversationCurrent(firstUser);
              users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
            }
          },
        });
      },
    });
  };

  const onUploadFile = (filex) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: filex,
      callback: (response) => {
        if (response) {
          mountedSet(setFile, (prev) => prev ? [...prev, { url: response?.results[0]?.fileInfo?.url, name: response?.results[0]?.fileInfo?.name }] : [{ url: response?.results[0]?.fileInfo?.url, name: response?.results[0]?.fileInfo?.name }]);
          setMessageFile([...file, { url: response?.results[0]?.fileInfo?.url, name: response?.results[0]?.fileInfo?.name }]);
        }
      },
    });
  };

  const props = {
    beforeUpload: () => null,
    customRequest({ file }) {
      onUploadFile(file);
    },
    showUploadList: (!!file),
  };

  const onStatus = (attributes, url, id) => {
    const mesegerRead = messagers?.filter(
      i => i?.attributes?.from !== conversationCurrent?.user_facebook_info_id
        && i?.attributes?.status_send_message === "READ");

    const check = attributes?.content?.substr(-4, 4);
    const checkHttp = attributes?.content?.lastIndexOf("https://");
    const checkAudio = attributes?.content?.lastIndexOf("audioclip");

    const a = url?.map(i => i?.substring(i.length, i.length - 4));
    if (check === '.jpg' || check === '.png' || check === 'jpeg' || check === '.bmp' || check === '.dib' || check === 'heic' || check === 'heif' || check === '.gif'
      || check === '.iff' || check === 'jfef' || check === '.jp2' || check === 'jpe' || check === 'jpeg' || check === '.psd' || check === '.tif'
      || check === 'HEIF' || check === '.IFF' || check === 'JFIF' || check === '.JP2' || check === '.JPE' || check === 'JPEG' || check === 'JPG'
      || check === '.PNG' || check === '.PSD' || check === '.TIF' || check === 'jpe' || check === 'TIFF' || check === 'WBMP' || check === 'WEBP' || check === 'HIEC') {
      return (
        <>
          {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
            <>
              <div className={styles['messager-sendImg']}>
                <Image
                  width={200}
                  height={200}
                  src={attributes?.content}
                  className={styles['messager-img']}
                />
              </div>
              <div className={styles['messager-send-icon']}>
                <p className={styles.time}>
                  {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                </p>
                {
                  mesegerRead[0]?.id === id && (
                    <img className={styles.iconRead} src={conversationCurrent?.userFacebookInfo?.avatar} alt="icon" />
                  )
                }
                {
                  attributes?.status_send_message === "RECEIVED" && (
                    <div className={styles.iconReceived}>
                      <span className="icon-checkmark" role="presentation" />
                    </div>
                  )
                }
                {
                  attributes?.status_send_message === "SEND" && (
                    <div className={styles.iconSend}>
                      <span className="icon-checkmark" role="presentation" />
                    </div>
                  )
                }
              </div>
            </>

          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <Image
                width={200}
                height={200}
                src={attributes?.content}
              />
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>
            </div>
          )}

        </>

      );

    }
    if (check === '.mp4' && checkAudio === -1) {

      return (
        <>
          {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
            <>
              <div className={styles['messager-video']}>
                <video controls width={300} className={styles.video} >
                  <source src={attributes?.content} />
                </video>
              </div>
              <div className={styles['messager-send-icon']}>
                <p className={styles.time}>
                  {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                </p>
                {
                  mesegerRead[0]?.id === id && (
                    <img className={styles.iconRead} src={conversationCurrent?.userFacebookInfo?.avatar} alt="icon" />
                  )
                }
                {
                  attributes?.status_send_message === "RECEIVED" && (
                    <div className={styles.iconReceived}>
                      <span className="icon-checkmark" role="presentation" />
                    </div>
                  )
                }
                {
                  attributes?.status_send_message === "SEND" && (
                    <div className={styles.iconSend}>
                      <span className="icon-checkmark" role="presentation" />
                    </div>
                  )
                }
              </div>
            </>
          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <video controls width={300} className={styles.video}>
                <source src={attributes?.content} />
              </video>
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>

            </div>
          )}
        </>
      );
    }
    if (check === '.mp3' || checkAudio !== -1) {
      return (
        <>
          {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-item']}>
              <div className={styles['messager-mp3']}>
                <video controls height={50} width={'50%'} className={styles.video}>
                  <source src={attributes?.content} />
                </video>
              </div>
              <div className={styles['messager-send-icon']}>
                <p className={styles.time}>
                  {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                </p>
                {
                  mesegerRead[0]?.id === id && (
                    <img className={styles.iconRead} src={conversationCurrent?.userFacebookInfo?.avatar} alt="icon" />
                  )
                }
                {
                  attributes?.status_send_message === "RECEIVED" && (
                    <div className={styles.iconReceived}>
                      <span className="icon-checkmark" role="presentation" />
                    </div>
                  )
                }
                {
                  attributes?.status_send_message === "SEND" && (
                    <div className={styles.iconSend}>
                      <span className="icon-checkmark" role="presentation" />
                    </div>
                  )
                }
              </div>
            </div>
          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <div className={styles['messager-mp3']} >
                <video controls height={50} width={'50%'} className={styles.video}>
                  <source src={attributes?.content} />
                </video>
              </div>
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>

            </div>
          )}
        </>
      );
    }
    // if (arrFile?.indexOf(".mp4")) {
    //   return (
    //     <>
    //       {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
    //         <div className={styles['messager-item']}>
    //           <div className={styles['messager-video']}>
    //             <video controls height={200} width={300} className={styles.video} >
    //               <source src={attributes?.content} />
    //             </video>
    //           </div>
    //           <div className={styles['messager-send']}>
    //             <p className={styles.time}>
    //               <Spin />
    //             </p>
    //           </div>
    //         </div>
    //       )}
    //     </>
    //   );
    // } 
    if (check && checkHttp !== -1) {
      return (
        <>
          {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
            <>
              <div className={styles['messager-item']}>
                <div className={styles['messager-send']}>
                  <div className={styles['messager-file']}>
                    <a href={attributes?.content} download={files} className='icon-download' style={{ color: "white" }} />
                    <div className='d-flex'>
                      <p className='pr10'>Một file đính kèm</p>
                      <img src="/images/facebook/messagesFile.png" alt="facebook" className={styles.icon} />
                    </div>
                  </div>
                  <div className={styles['messager-send-icon']}>
                    <p className={styles.time}>
                      {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                    </p>
                    {
                      mesegerRead[0]?.id === id && (
                        <img className={styles.iconRead} src={conversationCurrent?.userFacebookInfo?.avatar} alt="icon" />
                      )
                    }
                    {
                      attributes?.status_send_message === "RECEIVED" && (
                        <div className={styles.iconReceived}>
                          <span className="icon-checkmark" role="presentation" />
                        </div>
                      )
                    }
                    {
                      attributes?.status_send_message === "SEND" && (
                        <div className={styles.iconSend}>
                          <span className="icon-checkmark" role="presentation" />
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </>
          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <div className={styles['messager-file']}>
                <div className='d-flex'>
                  <img src="/images/facebook/messagesFile.png" alt="facebook" className={styles.icon} />
                  <p className='pl10'>Một file đính kèm</p>
                </div>
                <a href={attributes?.content} download={files} className='icon-download' />
              </div>
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>
            </div>
          )}
        </>
      );
    }
    return (
      <>
        {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
          <div className={styles['messager-item']}>
            <div className={styles['messager-send']}>
              <div className={styles['messager-content']}>{attributes?.content}</div>
              <div className={styles['messager-send-icon']}>
                <p className={styles.time}>
                  {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                </p>
                {
                  mesegerRead[0]?.id === id && (
                    <img className={styles.iconRead} src={conversationCurrent?.userFacebookInfo?.avatar} alt="icon" />
                  )
                }
                {
                  attributes?.status_send_message === "RECEIVED" && (
                    <div className={styles.iconReceived}>
                      <span className="icon-checkmark" role="presentation" />
                    </div>
                  )
                }
                {
                  attributes?.status_send_message === "SEND" && (
                    <div className={styles.iconSend}>
                      <span className="icon-checkmark" role="presentation" />
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        )}
        {attributes?.from === conversationCurrent?.user_facebook_info_id && (
          <div className={styles['messager-recieve']}>
            {/* <audio controls loop autoplay>
              <source src="/images/facebook/soundMesenger.mp3" type="audio/mpeg"  controls loop autoplay/>
            </audio> */}
            <div className={styles['messager-content']}>{attributes?.content}</div>
            <p className={styles.time}>
              {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
            </p>
          </div>
        )}
      </>
    );
  };
  console.log("conversationCurrent", conversationCurrent)
  const onSnippet = (attributes, from, to, name) => {

    const check = attributes?.substr(-4, 4);
    const checkHttp = attributes?.lastIndexOf("https://");
    if (pageID[0]?.id === from) {
      if (check === '.jpg' || check === '.png') {
        return (
          <>
            <p className={styles.norm}>Bạn Đã gửi một ảnh</p>
          </>
        );

      }
      if (check === '.mp4') {
        return (
          <>
            <p className={styles.norm}>Bạn Đã gửi một video</p>
          </>
        );
      } if (check && checkHttp !== -1) {
        return (
          <>
            <p className={styles.norm}>Bạn Đã gửi một file</p>
          </>
        );
      }
      return (
        <>
          <p className={styles.norm}>Bạn: {attributes}</p>
        </>
      );
    }
    if (pageID[0]?.id !== from) {
      if (check === '.jpg' || check === '.png') {
        return (
          <>
            <p className={styles.norm}>{name} Đã gửi một ảnh</p>
          </>
        );

      }
      if (check === '.mp4') {
        return (
          <>
            <p className={styles.norm}>{name} Đã gửi một video</p>
          </>
        );
      } if (check && checkHttp !== -1) {
        return (
          <>
            <p className={styles.norm}>{name} Đã gửi một file</p>
          </>
        );
      }
      return (
        <>
          <p className={styles.norm}>{attributes}</p>
        </>
      );
    }
  };

  const preventDefault = (e, page) => {
    setNotiInbox(false);
    setNotReply(false);
    setCheckPhone(false);
    setCheckNotPhone(false);
    setCheckBoxUser([]);
    setCheckBox([]);
    mountedSet(setSearchUser, {
      page: 1,
      limit: 10,
      total: 1,
      hasMore: true,
      loading: false,
    });
    setLoadingMessageUser(true);
    setLoadingUser(true);
    setLoadingMessage(true);
    setUsers(undefined);
    setMessagers([]);
    setNoteModal(false);
    setNoteValue();
    setConversationCurrent({});
    setSelectEmployee({});
    dispatch({
      type: 'crmFBDevV1/GET_CONVERSATIONS',
      payload: { page_id_facebook: e },
      callback: (response) => {
        if (response) {
          mountedSet(setSearchParent, ({
            page: 1,
            limit: 10,
            total: 0,
            hasMore: true,
            loading: false,
          }));
          const firstUser = head(
            response?.parsePayload?.map((item) => ({
              ...item,
            })),
          );
          setConversationCurrent(firstUser);
          setSelectEmployee(firstUser);
          setPageID(page?.filter(i => i?.attributes?.page_id_facebook === e));
          setUsers(
            response?.parsePayload?.map((item) => ({
              ...item,
            })),
          );
          setLoadingMessage(true);
          setLoadingUser(false);
        }
      },
    });
    dispatch({
      type: 'crmFBDevV1/GET_TAGS',
      payload: {},
    });
  };

  const handleInfiniteOnLoadMessages = () => {
    mountedSet(setSearchParent, { ...searchParent, loading: true });
    if (messagers.length >= searchParent.total) {
      mountedSet(setSearchParent, { ...searchParent, hasMore: false, loading: false });
      return;
    }

    dispatch({
      type: 'crmFBDevV1/GET_MESSAGES',
      payload: {
        ...searchParent,
        page: searchParent.page + 1,
        conversation_id: conversationCurrent?.id,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setMessagers, messagers.concat(response.data));
          mountedSet(setSearchParent, {
            ...searchParent,
            total: response.meta.pagination.total,
            page: searchParent.page + 1,
            loading: false,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setSearchParent, { ...searchParent, hasMore: false, loading: false });
        }
      },
    });
  };

  const handleInfiniteOnLoadUser = () => {
    const pageId = page?.find(i => i?.id === pageID[0]?.id);
    mountedSet(setSearchUser, { ...searchUser, loading: true });
    if (users.length >= searchUser.total) {
      mountedSet(setSearchUser, { ...searchUser, hasMore: false, loading: false });
      return;
    }
    dispatch({
      type: 'crmFBDevV1/GET_CONVERSATIONS',
      payload: {
        page_id: pageId?.id,
        ...searchUser,
        page: searchUser.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setUsers, users.concat(response?.parsePayload));
          mountedSet(setSearchUser, {
            ...searchUser,
            total: response.pagination.total,
            page: searchUser.page + 1,
            loading: false,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setSearchUser, { ...searchUser, hasMore: false, loading: false });
        }
      },
    });
  };

  //NOTE
  const onChangeNote = (value) => {
    mountedSet(setNoteValue, value);
  };
  const handleNote = () => {
    dispatch({
      type: 'crmFBDevV1/UPDATE_NOTE',
      payload: { noteValue, conversationCurrent },
      callback: (response) => {
        if (response) {
          setNoteModal(false);
        }
      },
    });
  };

  //STUDENT
  const onChaneDate = (e) => {
    mountedSet(setDayOfBirth, e);
  };

  const onFinish = (values) => {
    const items = values?.data?.map((item) => ({
      ...item,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: item.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    }));
    const payload = { ...values, student_info: items?.length > 0 ? items : [], user_facebook_info_id: conversationCurrent?.user_facebook_info_id };
    dispatch({
      type: 'crmFBDevV1/ADD_LEAD',
      payload,
      callback: (response, error) => {
        if (response) {
          setConversationCurrent([]);
          dispatch({
            type: 'crmFBDevV1/GET_CONVERSATIONSID',
            payload: { conversation_id: conversationCurrent?.id, },
            callback: (response) => {
              if (response) {
                const firstUser = head(
                  response?.parsePayload?.map((item) => ({
                    ...item,
                  })),
                );
                setNoteValue(response?.parsePayload[0]?.userFacebookInfo?.note);
                setConversationCurrent(firstUser);
                users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
                if (conversationCurrent?.userFacebookInfo?.customer_lead_id) {
                  dispatch({
                    type: 'crmFBDevV1/GET_LEAD',
                    payload: conversationCurrent,
                    callback: (response) => {
                      if (response) {
                        const firstUser = head(
                          response?.parsePayload?.map((item) => ({
                            ...item,
                          })),
                        );
                        setDetailLead(firstUser);
                        const potetial = firstUser?.statusLead?.map(i =>
                          i?.status === 'POTENTIAL' ? i : ""
                        ).pop();
                        if (potetial) {
                          dispatch({
                            type: 'crmFBDevV1/GET_POTENTIAL',
                            payload: firstUser?.customer_lead_id,
                          });
                        }
                      }
                    },
                  });
                }
              }
            },
          });
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };


  const onChangeEmployeeFb = (e) => {
    dispatch({
      type: 'crmFBDevV1/ADD_EMPLOYEE_FACEBOOK',
      payload: { user_facebook_info_id: conversationCurrent?.userFacebookInfo?.id, employee_facebook_id: e },
      callback: () => {
        dispatch({
          type: 'crmFBDevV1/GET_CONVERSATIONS_ID',
          payload: { conversation_id: conversationCurrent?.id, },
          callback: (response) => {
            if (response) {
              const firstUser = head(
                response?.parsePayload?.map((item) => ({
                  ...item,
                })),
              );
              setConversationCurrent(firstUser);
              setSelectEmployee(firstUser);
              users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
            }
          },
        });
      },
    });
  };
  const onChangeDeleteEmployeeFb = () => {
    dispatch({
      type: 'crmFBDevV1/DELETE_EMPLOYEE_FACEBOOK',
      payload: { user_facebook_info_id: conversationCurrent?.userFacebookInfo?.id, employee_facebook_id: conversationsId[0]?.userFacebookInfo?.employeeFacebook?.id },
      callback: () => {
        dispatch({
          type: 'crmFBDevV1/GET_CONVERSATIONS_ID',
          payload: { conversation_id: conversationCurrent?.id, },
          callback: (response) => {
            if (response) {
              const firstUser = head(
                response?.parsePayload?.map((item) => ({
                  ...item,
                })),
              );
              setConversationCurrent(firstUser);
              setSelectEmployee(firstUser);
              users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
            }
          },
        });
      },
    });
  };

  //SEARCH
  const onChangSearch = (e, types, check) => {
    setLoadingUser(true);
    setLoadingMessage(true);
    setLoadingMessageUser(true);
    const pageId = page?.find(i => i?.id === pageID[0]?.id);
    if (check) {
      setSearch(e);
    }
    setSearchE(e);
    if (e) {
      dispatch({
        type: 'crmFBDevV1/GET_CONVERSATIONS',
        payload: {
          page_id: pageId?.id,
          page: 1,
          limit: 10,
          total: 1,
          hasMore: true,
          loading: false,
          [`${check === 'name_inbox' ? check : ""}`]: (`${check === 'name_inbox' ? search?.target?.value : ""}`),
          [`${types === 'tag_id' ? types : ""}`]: `${types === 'tag_id' ? checkbox?.map(i => i?.id) : ""}`,
          [`${types === 'employee_facebook_id' ? types : ""}`]: `${types === 'employee_facebook_id' ? e : ""}`,
          [`${types === 'noti_inbox' ? types : ""}`]: `${types === 'noti_inbox' ? 'NOT_SEEN' : ""}`,
          [`${types === 'not_reply' ? types : ""}`]: `${types === 'not_reply' ? true : ""}`,
          [`${types === 'phone_number' ? 'not_phone_number' : ""}`]: `${types === 'phone_number' ? 'false' : ""}`,
          [`${types === 'not_phone_number' ? types : ""}`]: `${types === 'not_phone_number' ? true : ""}`
        },
        callback: (response) => {
          if (response) {
            if (response?.parsePayload.length <= 0 || !response?.parsePayload) {
              setMessagers([]);
            }
            setLoadingUser(false);
            setLoadingMessage(false);
            setLoadingMessageUser(false);
            setSearchData(false);
            setLoadingUser(false);
            formRef.setFieldsValue({
              data: [""]
            });
            setSelectEmployee(response?.parsePayload);
            setUsers(response?.parsePayload);
            setLoadingMessageUser(false);
            const firstUser = head(
              response?.parsePayload?.map((item) => ({
                ...item,
              })),
            );
            setConversationCurrent(firstUser);
            mountedSet(setSearchUser, {
              page: 1,
              limit: 10,
              hasMore: true,
              loading: false,
              total: response.pagination.total
            });
          }
        },
      });
    }
  };

  useEffect(() => {
    onChangSearch();
  }, [searchE]);

  const onChangeModal = () => {
    setIsAction((prev) => !prev);
    setSearchData(false);
  };

  const changeCheckboxEmployee = (id, name, color_code, types) => {
    if (types === 'tags') {
      const a = checkbox.find(i => i.id === id);
      checkbox.splice(checkbox?.indexOf(a), a ? 1 : 0);
      setCheckBox((prev) => (a ? [...prev] : [...prev, { id, name, color_code }]));
    }
    if (types === 'employee_facebook_id') {
      setModalUser(false);
      setCheckBoxUser([{ id, name }]);
      return onChangSearch(id, types);
    }
  };

  const changeCheckboxTag = (id, type) => {
    const a = checkbox.find(i => i.id === id);
    const b = checkboxUser.find(i => i.id === id);
    checkbox.splice(checkbox?.indexOf(a), a ? 1 : 0);
    setCheckBox((prev) => [...prev]);
    checkboxUser.splice(checkboxUser?.indexOf(b), b ? 1 : 0);
    setCheckBoxUser((prev) => [...prev]);
    onChangSearch(checkbox, type);
    if (type === 'tag_id') {
      setSearch();
    }
    if (type === 'employee_facebook_id') {
      setSearch();
    }
    setNotiInbox(false);
    setNotReply(false);
    setCheckPhone(false);
    setCheckNotPhone(false);
  };

  const onChangeSearchModal = (type) => {
    if (type === 'tags') {
      setNotiInbox(false);
      setNotReply(false);
      setCheckPhone(false);
      setCheckBoxUser([]);
      setCheckNotPhone(false);
      setSearchModal('tags');
      setSearchData(true);
      setModalTag(true);
      setModalUser(false);
    }
    if (type === 'employee_facebook_id') {
      setModalTag(false);
      setModalUser(true);
      setNotiInbox(false);
      setNotReply(false);
      setCheckPhone(false);
      setCheckNotPhone(false);
      setSearchModal('employee_facebook_id');
      setCheckBox([]);
      setSearchData(true);
    }
    if (type === 'noti_inbox') {
      setSearchModal('noti_inbox');
      setNotiInbox(true);
      setNotReply(false);
      setCheckPhone(false);
      setCheckNotPhone(false);
      setModalTag(false);
      setModalUser(false);
      setCheckBox([]);
      setCheckBoxUser([]);
      onChangSearch('noti_inbox', 'noti_inbox');
      setSearchData(true);
    }
    if (type === 'not_reply') {
      setNotiInbox(false);
      setNotReply(true);
      setCheckPhone(false);
      setCheckNotPhone(false);
      setModalTag(false);
      setModalUser(false);
      setSearchModal('not_reply');
      setCheckBox([]);
      setCheckBoxUser([]);
      onChangSearch('not_reply', 'not_reply');
      setSearchData(true);
    }
    if (type === 'phone_number') {
      setNotiInbox(false);
      setNotReply(false);
      setCheckPhone(true);
      setModalUser(false);
      setCheckNotPhone(false);
      setSearchModal('phone_number');
      setCheckBox([]);
      setCheckBoxUser([]);
      onChangSearch('phone_number', 'phone_number');
      setSearchData(true);
    }
    if (type === 'not_phone_number') {
      setNotiInbox(false);
      setNotReply(false);
      setCheckPhone(false);
      setCheckNotPhone(true);
      setModalUser(false);
      setModalTag(false);
      setSearchModal('not_phone_number');
      setCheckBox([]);
      setCheckBoxUser([]);
      onChangSearch('not_phone_number', 'not_phone_number');
      setSearchData(true);
    }
  };

  const onChangSearchBtn = () => {
    setModalTag(false);
    setSearchModal('tag_id');
    onChangSearch(checkbox, 'tag_id');
  };

  //SEARCH
  //STATUS LEAD
  const onStatusLead = () => {
    if (detailLead?.statusLead?.length) {
      return (
        <>
          {
            detailLead?.statusLead[(detailLead?.statusLead?.length - 1)]?.status === 'LEAD_NEW' && (
              <div className={styles['tags-container']} style={{ backgroundColor: '#E1F5E2', color: '#27A600' }}>
                <span> Lead mới</span>
              </div>
            )
          }
          {
            detailLead?.statusLead[(detailLead?.statusLead?.length - 1)]?.status === 'POTENTIAL' && (
              <div className={styles['tags-container']} style={{ backgroundColor: '#F3F7FF', color: '#0075CA' }}>
                <span>Có tiềm năng</span>
              </div>)
          }
          {
            detailLead?.statusLead[(detailLead?.statusLead?.length - 1)]?.status === 'NOT_POTENTIAL' && (
              <div className={styles['tags-container']} style={{ backgroundColor: 'rgb(255 224 224 / 75%)', color: 'rgb(255 0 0)' }}>
                <span>Không tiềm năng</span>
              </div>)
          }
          {
            !detailLead?.statusLead[(detailLead?.statusLead?.length - 1)]?.status && (
              <div className={styles['tags-container']} style={{ backgroundColor: '#FFEFDB', color: '#FF8300' }}>
                <span>Chưa là khách hàng</span>
              </div>)
          }
        </>);
    }
    if (JSON.stringify(detailLead) === '{}' && conversationCurrent) {
      return (<div className={styles['tags-container']}>
        <span>Chưa là khách hàng</span>
      </div>);
    }
    return "";
  };
  //STATUS LEAD
  const deleteNote = () => {
    setNoteModal(false);
    setNoteValue(conversationCurrent?.userFacebookInfo?.note);
  };
  //STATUS LEAD
  return (
    <div className={styles.wrapper}>
      <div className={styles['heading-container']}>
        <h3 className={styles.title}>Fanpage</h3>
      </div>
      <div className={styles['wrapper-container']}>
        {isEmpty(user) && (
          <div className={styles['wrapper-login']}>
            <FacebookLogin
              appId={APP_ID_FB}
              autoLoad={false}
              fields="name,email,picture,birthday"
              scope="public_profile,pages_show_list,pages_manage_metadata, pages_manage_posts, pages_read_engagement, pages_read_user_content, pages_manage_engagement, pages_messaging"
              callback={responseFacebook}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  type="button"
                  className={styles['button-login']}
                >
                  <span className="icon-facebook" />
                  Login FB
                </button>
              )}
            />
          </div>
        )}
        <div className={styles['sidebar-container']}>
          <div className={styles['sidebar-header']}>
            <img src="/images/facebook/logoFacebook.svg" alt="facebook" className={styles.icon} />
            <Select value={pageID[0]?.attributes?.name} bordered={false} onChange={(e) => preventDefault(e, page)}>
              {page?.map((i, index) =>
                <Option value={i?.attributes?.page_id_facebook} key={index} className={styles.norm}> {i?.attributes?.name}</Option>
              )}
            </Select>
          </div>
          <div className={styles['sidebar-actions']}>
            {!isAction && (
              <Input
                placeholder="Nhập"
                value={search?.target?.value}
                prefix={<SearchOutlined />}
                style={{ height: '39px' }}
                onChange={(e) => onChangSearch(e, searchModal, "name_inbox")}
                className={styles.input}
                suffix={
                  <span
                    className="icon-equalizer"
                    role="presentation"
                    onClick={() => setIsAction((prev) => !prev)}
                  />
                }
              />
            )}
            {isAction && (
              <div className={styles['actions-container']}>
                <img
                  src="/images/facebook/Tag.svg"
                  alt="facebookTag"
                  className={classnames(styles.icon)}
                  onClick={() => onChangeSearchModal('tags')}
                  role="presentation"
                  style={{ background: `${modalTag || checkbox.length > 0 ? "#F2F4F8" : ''}` }}
                />

                <img

                  src="/images/facebook/user.svg"
                  alt="facebookTag"
                  className={classnames(styles.icon)}
                  onClick={() => onChangeSearchModal('employee_facebook_id')}
                  role="presentation"
                  style={{ background: `${modalUser || checkboxUser.length > 0 ? "#F2F4F8" : ''}` }}
                />

                <img
                  src="/images/facebook/notSeen.svg"
                  alt="facebookTag"
                  className={classnames(styles.icon)}
                  onClick={() => onChangeSearchModal('noti_inbox')}
                  role="presentation"
                  style={{ background: `${notiInbox ? "#F2F4F8" : ''}` }}
                />

                <img
                  src="/images/facebook/notRep.svg"
                  alt="facebookTag"
                  className={classnames(styles.icon)}
                  onClick={() => onChangeSearchModal('not_reply')}
                  role="presentation"
                  style={{ background: `${notReply ? "#F2F4F8" : ''}` }}
                />

                <img
                  src="/images/facebook/phone.svg"
                  alt="facebookTag"
                  className={classnames(styles.icon)}
                  onClick={() => onChangeSearchModal('phone_number')}
                  role="presentation"
                  style={{ background: `${checkPhone ? "#F2F4F8" : ''}` }}
                />

                <img
                  src="/images/facebook/notPhone.svg"
                  alt="facebookTag"
                  className={classnames(styles.icon)}
                  onClick={() => onChangeSearchModal('not_phone_number')}
                  role="presentation"
                  style={{ background: `${checkNotPhone ? "#F2F4F8" : ''}` }}
                />

                <span
                  className={classnames(styles.icon, 'icon-cancel')}
                  role="presentation"
                  onClick={() => onChangeModal()}
                />
              </div>
            )}
          </div>
          <div className={styles['info-content']}>
            {checkbox?.length > 0 && (checkbox?.map(i =>
              <Tag
                closable
                color={i?.color_code}
                className="m5"
                onClose={() => changeCheckboxTag(i?.id, 'tag_id')}
                key={i?.id}
              >
                {i?.name}
              </Tag>))}
            {checkboxUser?.length > 0 && (checkboxUser?.map(i =>
              <Tag
                closable
                className="m5"
                onClose={() => changeCheckboxTag(i?.id, 'employee_facebook_id')}
                key={i?.id}
              >
                {i?.name}
              </Tag>))}
            {notiInbox && (
              <Tag
                closable
                className="m5"
                onClose={() => changeCheckboxTag("", '')}
              >
                Chưa đọc
              </Tag>)}
            {notReply && (
              <Tag
                closable
                className="m5"
                onClose={() => changeCheckboxTag("", '')}
              >
                Chưa phản hồi
              </Tag>)}
            {checkPhone && (
              <Tag
                closable
                className="m5"
                onClose={() => changeCheckboxTag("", '')}
              >
                Có số điện thoại
              </Tag>)}
            {checkNotPhone && (
              <Tag
                closable
                className="m5"
                onClose={() => changeCheckboxTag("", '')}
              >
                Chưa có số điện thoại
              </Tag>)}
            {searchModal === 'tags' && checkbox.length <= 0 && modalTag && (
              <p className={styles.norm}>Chọn tag hiển thị</p>
            )}
            {searchModal === 'employee_facebook_id' && modalUser && (
              <p className={styles.norm}>Nhân viên chỉ định</p>
            )}
            {
              checkboxUser.length <= 0 && checkbox.length <= 0 && !notiInbox && !notReply && !checkNotPhone && !checkPhone && !modalTag && !modalUser &&
              (<p className={styles.norm}>Gần đây</p>)
            }
          </div>
          <div className={styles['user-container']}>

            <div>
              {loadingUser
                && (
                  <>
                    <div className={classnames(styles['user-item'], {})} role="presentation">
                      <div className={styles['user-content']}>
                        <div className={styles['avatar-container']}>
                          <Skeleton.Avatar active size="default" shape="circle" />
                        </div>
                        <div className={styles['user-info']}>
                          <Skeleton.Input className="w-100" active size="default" />
                        </div>
                      </div>
                    </div>
                    <div className={classnames(styles['user-item'], {})} role="presentation">
                      <div className={styles['user-content']}>
                        <div className={styles['avatar-container']}>
                          <Skeleton.Avatar active size="default" shape="circle" />
                        </div>
                        <div className={styles['user-info']}>
                          <Skeleton.Input className="w-100" active size="default" />
                        </div>
                      </div>
                    </div>
                    <div className={classnames(styles['user-item'], {})} role="presentation">
                      <div className={styles['user-content']}>
                        <div className={styles['avatar-container']}>
                          <Skeleton.Avatar active size="default" shape="circle" />
                        </div>
                        <div className={styles['user-info']}>
                          <Skeleton.Input className="w-100" active size="default" />
                        </div>
                      </div>
                    </div>
                    <div className={classnames(styles['user-item'], {})} role="presentation">
                      <div className={styles['user-content']}>
                        <div className={styles['avatar-container']}>
                          <Skeleton.Avatar active size="default" shape="circle" />
                        </div>
                        <div className={styles['user-info']}>
                          <Skeleton.Input className="w-100" active size="default" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              {!loadingUser &&
                <Scrollbars
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={100}
                  autoHeight
                  autoHeightMax={searchModal === 'tags' ? "calc(100vh - 372px)" : "calc(100vh - 350px)"}
                >
                  <InfiniteScroll
                    hasMore={!searchUser.loading && searchUser.hasMore}
                    initialLoad={searchUser.loading}
                    loadMore={handleInfiniteOnLoadUser}
                    pageStart={0}
                    useWindow={false}
                  >
                    {searchModal === 'tags' && modalTag && (
                      <>
                        {tags?.map(({ id, name, color_code }) => (
                          <div className={styles['search-tags']} key={id}>
                            <Checkbox
                              className="mr15"
                              onChange={() => changeCheckboxEmployee(id, name, color_code, 'tags')}
                            />
                            <p style={{ background: `${color_code}` }} className={styles.title}>{name}</p>
                          </div>
                        ))}
                      </>)}
                    {searchModal === 'employee_facebook_id' && modalUser && (
                      <>
                        {employeeFB?.map(({ id, employee_fb_name, avatar }) => (
                          <div className={styles['search-tags']} key={id} onClick={() => changeCheckboxEmployee(id, employee_fb_name, null, 'employee_facebook_id')} role="presentation">
                            <img src={avatar}
                              alt="facebook"
                              className={styles.img} />
                            <p className={styles.title}>{employee_fb_name}</p>
                          </div>
                        ))}
                      </>)}
                    {
                      !searchData && users.length > 0 && !modalTag && !modalUser && (
                        users?.map(({ id, can_reply, userFacebookInfo, snippet, time, noti_inbox, from, to }) => (
                          <div
                            className={classnames(styles['user-item'], {
                              [styles['user-item-active']]:
                                userFacebookInfo?.id === conversationCurrent?.userFacebookInfo?.id,
                            })}
                            key={id}
                            role="presentation"
                            onClick={() => onChangeConversation(id)}
                          >
                            <div className={styles['user-content']}>
                              <div className={styles['avatar-container']}>
                                <span
                                  className={classnames(styles.dot, { [styles.active]: can_reply })}
                                />
                                <img
                                  src={userFacebookInfo?.avatar}
                                  alt="facebook"
                                  className={styles.img}
                                />
                              </div>
                              {noti_inbox === "SEEN" ?
                                <>
                                  {
                                    userFacebookInfo?.employeeFacebook ?
                                      <>
                                        <div className={styles['user-info']}>
                                          <div className={styles['user-info-title']}>
                                            <img
                                              src={userFacebookInfo?.employeeFacebook?.avatar}
                                              alt="fb"
                                              className={styles.img}
                                            />
                                            <span className="icon-next" role="presentation" />
                                            <h3 className={styles.title}>{userFacebookInfo?.user_name}</h3>
                                          </div>
                                          <div>{onSnippet(snippet, from, to, userFacebookInfo?.user_name)}</div>
                                        </div>
                                        <p className={styles.time}>
                                          {time?.substr(-5, 5)}
                                        </p>
                                      </>
                                      :
                                      <>
                                        <div className={styles['user-info']}>
                                          <h3 className={styles.title}>{userFacebookInfo?.user_name}</h3>
                                          <div>{onSnippet(snippet, from, to, userFacebookInfo?.user_name)}</div>
                                        </div>
                                        <p className={styles.time}>
                                          {time?.substr(-5, 5)}
                                        </p>
                                      </>
                                  }
                                </>
                                :
                                <>
                                  {userFacebookInfo?.employeeFacebook ?
                                    <div className={styles['user-info-notseen']}>
                                      <div className={styles['user-info-title']}>
                                        <img
                                          src={userFacebookInfo?.employeeFacebook?.avatar}
                                          alt="fb"
                                          className={styles.img}
                                        />
                                        <span className="icon-next" role="presentation" />
                                        <h3 className={styles.title}>{userFacebookInfo?.user_name}</h3>
                                      </div>
                                      <div>{onSnippet(snippet, from, to, userFacebookInfo?.user_name)}</div>
                                      <p className={styles.time}>
                                        {time?.substr(-5, 5)}
                                      </p>
                                    </div>
                                    :
                                    <div className={styles['user-info-notseen']}>
                                      <h3 className={styles.title}>{userFacebookInfo?.user_name}</h3>
                                      <div>{onSnippet(snippet, from, to, userFacebookInfo?.user_name)}</div>
                                      <p className={styles.time}>
                                        {time?.substr(-5, 5)}
                                      </p>
                                    </div>
                                  }
                                </>
                              }
                            </div>
                            {userFacebookInfo?.userFacebookInfoTag.map((i) =>
                              <div className='mt5' key={i?.id}>
                                <Tag style={{ backgroundColor: `${i?.tag?.color_code}` }}>{i?.tag?.name}</Tag>
                              </div>
                            )}
                          </div>
                        ))
                      )
                    }
                    {
                      !searchData && users.length === 0 && !modalTag && (
                        <div className={styles['search-user']}>
                          Chưa có dữ liệu
                        </div>
                      )
                    }


                  </InfiniteScroll>
                </Scrollbars>
              }

              {
                searchModal === 'tags' && modalTag &&
                (<div className={styles['search-tags-btn']}>
                  <Button color="success" htmlType="submit" onClick={() => onChangSearchBtn()} >
                    Áp dụng
                  </Button>
                </div>)
              }
            </div>
          </div>
        </div>
        <div className={styles['main-container']}>
          {
            loadingUser &&
            (
              <div className={styles['main-container-info']}>
                <div className={styles['avatar-container']}>
                  <Skeleton.Input className="w-100 h-100  rounded-circle" active size="default" />
                  {/* <span className={classnames(styles.dot, { [styles.active]: true })} />
                  <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} /> */}
                </div>
                <div style={{ height: '22px', width: '150px' }} className="d-flex pl10 align-items-center">
                  <Skeleton.Input className="w-100 h-100" active size="default" />
                </div>
              </div>
            )
          }
          {
            !loadingUser && !conversationCurrent && (
              <div className={styles['main-container-info']} style={{ height: '100%' }} />
            )
          }
          {
            !loadingUser && conversationCurrent &&
            (
              <div className={styles['main-container-info']}>
                <div className={styles['avatar-container']}>
                  <span className={classnames(styles.dot, { [styles.active]: true })} />
                  <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} />
                </div>
                <div className={styles['user-info']}>
                  <h3 className={styles.title}>{conversationCurrent?.userFacebookInfo?.user_name}</h3>
                  {selectEmployee?.userFacebookInfo?.employee_facebook_id &&
                    conversationsId[0]?.userFacebookInfo?.employee_facebook_id === selectEmployee?.userFacebookInfo?.employee_facebook_id && (
                      //  conversationsId[0]?.userFacebookInfo?.employee_facebook_id === conversationCurrent?.userFacebookInfo?.employee_facebook_id && conversationCurrent?.userFacebookInfo?.employee_facebook_id && (
                      <Select
                        size="small" className={styles.norm}
                        defaultValue={conversationsId[0]?.userFacebookInfo?.employeeFacebook?.employee_fb_name}
                        bordered={false}
                        onChange={(e) => onChangeEmployeeFb(e)}
                        dropdownRender={menu => (
                          <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <Space align="center" style={{ padding: '0 8px 4px' }}>
                              <Button htmlType="submit" className={styles['btn-select-delete']} onClick={(e) => onChangeDeleteEmployeeFb(e)}>Bỏ chỉ định</Button>
                            </Space>
                          </>
                        )}
                      >
                        {employeeFB?.map((i, index) =>
                          <Option value={i?.id} key={index}>{i?.employee_fb_name}</Option>
                        )}
                      </Select>)
                  }
                  {
                    !conversationsId[0]?.userFacebookInfo?.employeeFacebook?.employee_fb_name && (
                      <Select
                        defaultValue="Chọn nhân viên"
                        bordered={false}
                        onChange={(e) => onChangeEmployeeFb(e)}
                        dropdownRender={menu => (
                          <>
                            {
                              conversationsId[0]?.userFacebookInfo?.employeeFacebook?.employee_fb_name ?
                                <>
                                  {menu}
                                  <Divider style={{ margin: '8px 0' }} />
                                  <Space align="center" style={{ padding: '0 8px 4px' }}>
                                    <Button htmlType="submit" className={styles['btn-select-delete']} onClick={(e) => onChangeDeleteEmployeeFb(e)}>Bỏ chỉ định</Button>
                                  </Space>
                                </> : <> {menu} </>
                            }
                          </>
                        )}
                      >
                        {employeeFB?.map((i, index) =>
                          <Option value={i?.id} key={index}> {i?.employee_fb_name}</Option>
                        )}
                      </Select>
                    )
                  }
                </div>
              </div>
            )
          }
          {loadingMessage && (
            <div className={styles['messager-item']} style={{ width: '100%', height: 'calc(100vh - 350px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className={styles['messager-loader']} />
            </div>
          )
          }
          <div className={styles['messager-container']}>
            <div>
              {/* {loadingMessage && (
                <Scrollbars autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={100}
                  autoHeight
                  autoHeightMax="calc(100vh - 320px)"
                  renderTrackHorizontal={(props) => (
                    <div {...props} className="track-horizontal" style={{ display: 'none' }} />
                  )}
                  renderThumbHorizontal={(props) => (
                    <div {...props} className="thumb-horizontal" style={{ display: 'none' }} />
                  )}
                  ref={scrollbars}>
                  <div className={styles['messager-group']}>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                  </div>
                </Scrollbars>
              )} */}
              {!loadingMessage && (
                <div className="border-bottom">
                  <Scrollbars autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={100}
                    autoHeight
                    autoHeightMax={files?.length > 0 ? "calc(100vh - 380px)" : "calc(100vh - 320px)"}
                    renderTrackHorizontal={(props) => (
                      <div {...props} className="track-horizontal" style={{ display: 'none' }} />
                    )}
                    renderThumbHorizontal={(props) => (
                      <div {...props} className="thumb-horizontal" style={{ display: 'none' }} />
                    )}
                    ref={scrollbars}>
                    <InfiniteScroll
                      hasMore={!searchParent.loading && searchParent.hasMore}
                      initialLoad={searchParent.loading}
                      loadMore={handleInfiniteOnLoadMessages}
                      style={{ display: 'flex', flexDirection: 'column-reverse' }}
                      scrollableTarget="scrollableDiv"
                      pageStart={1}
                      useWindow={false}
                      isReverse
                    >

                      {messagers?.map(({ attributes, url, id }, index) => (
                        <div className={styles['messager-item']} key={index} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                          <div className={styles['messager-item']} >
                            <div>{onStatus(attributes, url, id)}</div>
                          </div>
                        </div>
                      ))}

                    </InfiniteScroll>
                  </Scrollbars>
                </div>
              )}
            </div>

          </div>
          <div className={styles['messages-container']}>
            <Upload {...props}
              fileList={undefined}
            >
              <div className={styles['chat-icon']}>
                <span className="icon-attachment" />
              </div>
            </Upload>
            <MultipleImageUpload
              files={files}
              callback={(files) => uploadFiles(files)}
              removeFiles={(files) => mountedSet(setFiles, files)}
            />
            <div className='d-flex'>
              <div className={styles['chat-container']}>
                <Input
                  autosize={{ minRows: 1, maxRows: 1 }}
                  width={80}
                  placeholder="Nhập tin nhắn"
                  onPressEnter={onPressEnter}
                  className={styles.input}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className={styles['group-icon']}>
                  {/* <span className="icon-attachment" /> */}

                  {/* <p className="icon-smile" /> */}
                </div>
              </div>


            </div>
          </div>

        </div>
        {loadingMessageUser && (
          <div className={styles['info-container']}>
            <div className={styles['user-container']}>
              <div style={{ height: '100px', width: '100px' }}>
                <Skeleton.Input className="w-100 h-100  rounded-circle" active size="default" />
              </div>
              <div style={{ height: '100px', width: '150px' }} className="d-flex align-items-center">
                <Skeleton.Input className="w-100 pl10 pb10" active size="default" />
              </div>
            </div>
            <div className={styles['actions-container']}>
              <Skeleton.Input className="w-100" active size="default" />
            </div>
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={100}
              autoHeight
              autoHeightMax="calc(100vh - 450px)"
            >
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
            </Scrollbars>
          </div>
        )}
        {
          !loadingMessageUser && !conversationCurrent && (
            <div className={styles['info-container']} />
          )
        }
        {!loadingMessageUser && conversationCurrent && (
          <div className={styles['info-container']}>
            <div className={styles['user-container']}>
              <div className={styles['avatar-container']}>
                <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} />
              </div>
              <div className='pl10'>
                <div className={styles['user-info']}>
                  <p className={styles.norm}>{conversationCurrent?.userFacebookInfo?.status === 'LEAD' ?
                    detailLead?.full_name
                    : conversationCurrent?.userFacebookInfo?.user_name}</p>
                </div>
                <div className={styles['status-container']}>
                  {onStatusLead()}
                </div>
              </div>
            </div>
            {/* <div className={styles['actions-container']}>
              <Button color="white" icon="email-plus" />
              <Button color="white" icon="phone-plus" />
              <Button color="white" icon="calendar-plus" />
              <Button color="white" icon="add-file-plus" />
            </div> */}
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={100}
              autoHeight
              autoHeightMax="calc(100vh - 300px)"
            >
              {
                conversationCurrent?.userFacebookInfo?.status === 'LEAD' && conversationCurrent?.userFacebookInfo?.customer_lead_id === detailLead?.id ?

                  <div className={styles['contact-container']}>
                    <div className={styles['information-parents']}>
                      <div className='d-flex justify-content-between'>
                        <h3 className={styles.title}>THÔNG TIN CHUNG</h3>
                        <a className={styles.link} href={`/crm/sale/ph-lead/${detailLead.id}/chi-tiet`} target="_blank" role="presentation">Xem tất cả</a>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Họ và tên</p>
                        <h3 className={styles.name}>{detailLead?.full_name}</h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Giới tính</p>
                        <h3 className={styles.name}>
                          {detailLead?.sex === "MALE" ? "Nam" : ""}
                          {detailLead?.sex === "FEMALE" ? "Nữ" : ""}
                          {detailLead?.sex === "OTHER" ? "Khác" : ""}
                        </h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Ngày sinh</p>
                        <h3 className={styles.name}>{detailLead?.birth_date}</h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Điện thoại</p>
                        <h3 className={styles.name}>{detailLead?.phone}</h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Email</p>
                        <h3 className={styles.name}>{detailLead?.email}</h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Địa chỉ</p>
                        <h3 className={styles.name}>{detailLead?.address}</h3>
                      </div>
                    </div>
                    <div className={styles['information-students']}>
                      <h3 className={styles.title}>THÔNG TIN HỌC SINH</h3>
                      {
                        detailLead?.studentInfo?.map((item, index) =>
                          <div key={index}>
                            <div className={styles['students-titles']}>
                              <div type="form-title" className={styles.titleContent}>
                                Học sinh {index + 1}
                              </div>
                            </div>
                            <div className={styles['contact-items']}>
                              <p className={styles.label}>Họ và tên</p>
                              <h3 className={styles.name}>{item?.full_name}</h3>
                            </div>
                            <div className={styles['contact-items']}>
                              <p className={styles.label}>Giới tính</p>
                              <h3 className={styles.name}>
                                {item?.sex === "MALE" ? "Nam" : ""}
                                {item?.sex === "FEMALE" ? "Nữ" : ""}
                                {item?.sex === "OTHER" ? "Khác" : ""}
                              </h3>
                            </div>
                            <div className={styles['contact-items']}>
                              <p className={styles.label}>Ngày sinh</p>
                              <h3 className={styles.name}>{item.birth_date} ({item?.age_month} Tháng tuổi)</h3>
                            </div>
                            <div className={styles['contact-items']}>
                              <p className={styles.label}>Mối quan hệ</p>
                              <h3 className={styles.name}>{item?.categoryRelationship?.name}</h3>
                            </div>
                          </div>
                        )
                      }
                    </div>
                    {detailLead?.statusLead
                      ?.map((item, index) => (
                        <div key={index}>
                          {
                            item?.status === 'POTENTIAL' ?
                              <div className={styles['information-students']}>
                                <h3 className={styles.title}>TÌNH TRẠNG TIỀM NĂNG</h3>
                              </div>
                              : ""
                          }
                        </div>
                      ))
                      .pop()}
                  </div>
                  :
                  <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                    <div className={styles['contact-container']}>
                      <div className={styles['information-parents']}>
                        <h3 className={styles.title}>THÔNG TIN CHUNG</h3>
                        <div className={styles['contact-item']}>
                          <label className={styles.labelRequired}>
                            <p>Họ và tên</p>
                          </label>
                          <FormItem
                            name="user_full_name"
                            type={variables.INPUT}
                            className={styles.norm}
                            rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <label className={styles.labelRequired}>
                            <p>Giới tính</p>
                          </label>
                          <FormItem
                            options={['id', 'name']}
                            data={sex}
                            placeholder=" Chọn"
                            name='sex'
                            className={styles.norm}
                            type={variables.SELECT}
                            rules={[variables.RULES.EMPTY_INPUT]}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <p className={styles.label}>Ngày sinh</p>
                          <FormItem
                            name="user_birth_date"
                            className={styles.norm}
                            type={variables.DATE_PICKER}
                            disabledDate={(current) => current > moment()}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <label className={styles.labelRequired}>
                            <p>Điện thoại</p>
                          </label>
                          <FormItem
                            name="user_phone"
                            className={styles.norm}
                            type={variables.INPUT}
                            rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <p className={styles.label}>Email</p>
                          <FormItem
                            name="user_email"
                            className={styles.norm}
                            type={variables.EMAIL}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <p className={styles.label}>Địa chỉ</p>
                          <FormItem
                            name="user_address"
                            className={styles.norm}
                            type={variables.INPUT}
                          />
                        </div>
                      </div>
                      <div className={styles['information-students']}>
                        <h3 className={styles.title}>THÔNG TIN HỌC SINH</h3>
                        <Form.List name="data">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, index) => (
                                <div
                                  key={field.key}
                                  className='border-bottom'
                                >
                                  <div className={styles['students-title']}>
                                    <div type="form-title" className={styles.titleContent}>
                                      Học sinh {index + 1}
                                    </div>
                                    {fields.length > 0 && (
                                      <DeleteOutlined
                                        onClick={() => {
                                          remove(index);
                                        }}
                                      />
                                    )}
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Họ và tên</p>
                                        <FormItem
                                          name={[field.name, 'full_name']}
                                          className={styles.norm}
                                          fieldKey={[field.fieldKey, 'full_name']}
                                          type={variables.INPUT}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Giới tính</p>
                                        <FormItem
                                          data={sex}
                                          className={styles.norm}
                                          name={[field.name, 'sex']}
                                          fieldKey={[field.fieldKey, 'sex']}
                                          type={variables.SELECT}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Ngày sinh</p>
                                        <FormItem
                                          name={[field.name, 'birth_date']}
                                          className={styles.norm}
                                          fieldKey={[field.fieldKey, 'birth_date']}
                                          type={variables.DATE_PICKER}
                                          onChange={onChaneDate}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Tháng tuổi</p>
                                        {
                                         file?.age_month >= 0 ?
                                            <Form.Item >
                                              <Text size="normal" className={styles.norm}>
                                                {file?.age_month}
                                              </Text>
                                            </Form.Item>
                                            : <Form.Item name={[field.name, 'age_month']} className={styles.norm}>
                                              {dayOfBirth &&
                                                moment().diff(moment(dayOfBirth), 'month')} Tháng tuổi
                                            </Form.Item >
                                        }
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Mối quan hệ</p>
                                        <FormItem
                                          data={relationships}
                                          className={styles.norm}
                                          name={[field.name, 'category_relationship_id']}
                                          fieldKey={[field.fieldKey, 'category_relationship_id']}
                                          type={variables.SELECT}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className={styles['students-add']}>
                                <p
                                  role="presentation"
                                  color="success"
                                  ghost
                                  className="icon-plus-circle"
                                  onClick={() => {
                                    add();
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </Form.List>
                      </div>
                      <div className={styles['menuRight-add']}>
                        <Button color="success" htmlType="submit" className="w-100">
                          Thêm phụ huynh Lead
                        </Button>
                      </div>
                    </div>
                  </Form>
              }

              <div className={styles['tags-container']}>
                <h3 className={styles.title}>GẮN TAGS</h3>
                <div >
                  <Select
                    showArrow
                    value={conversationCurrent?.userFacebookInfo?.userFacebookInfoTag?.map((item) => item?.tag?.id)}
                    mode="multiple"
                    className={styles['wrapper-tags']}
                    onChange={(e) => onSelectColor(e)}
                    tagRender={({ label, value, color_code, closable, onClose }) => {
                      const itemTag = tags.find(item => item.id === value);
                      return (
                        <Tag
                          color={itemTag?.color_code || color_code}
                          closable={closable}
                          onClose={onClose}
                          className={styles['tags-content']}
                        >
                          {label}
                        </Tag>
                      );
                    }}
                  >
                    {tags.map((item, index) => (
                      <Option
                        value={item?.id}
                        key={index}
                        style={{ backgroundColor: `${item?.color_code}` }}
                      >
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className={styles['note-container']}>
                <div className={styles['note-heading']}>
                  <h3 className={styles.title}>GHI CHÚ</h3>
                  <span className="icon-write-plus" onClick={() => setNoteModal(!noteModal)} role="presentation" />
                </div>
                <div className={styles['note-body']}>
                  <div>
                    {noteModal ?
                      <div>
                        <Input.TextArea className={styles.text} autoSize={{ minRows: 4, maxRows: 4 }} value={noteValue} onChange={(e) => onChangeNote(e.target.value)} />
                        <div className='d-flex justify-content-end pt5 align-items-center'>
                          <p
                            className="btn-delete mr10"
                            role="presentation"
                            onClick={() => deleteNote(false)}
                          >
                            Hủy
                          </p>
                          <Button
                            key="submit"
                            color="success"
                            type="primary"
                            className={styles['cheack-btn-ok']}
                            onClick={handleNote}
                          >
                            Lưu
                          </Button>
                        </div>
                      </div>
                      :
                      <div className='d-flex justify-content-between'>
                        {noteValue}

                      </div>
                    }
                  </div>
                </div>
              </div>

            </Scrollbars>
          </div>
        )}
      </div>
    </div>
  );
});


export default Index;