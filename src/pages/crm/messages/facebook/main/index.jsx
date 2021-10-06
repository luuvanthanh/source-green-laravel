import React, { memo, useState } from 'react';

import { Form, Input, Upload } from 'antd';
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import { Scrollbars } from 'react-custom-scrollbars';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [user, setUser] = useState({});

  const responseFacebook = (response) => {
    setUser(response);
  };

  return (
    <>
      {!isEmpty(user) && (
        <div className={stylesModule['wrapper-login']}>
          <FacebookLogin
            appId={APP_ID_FB}
            autoLoad
            fields="name,email,picture"
            callback={responseFacebook}
            render={(renderProps) => (
              <button
                onClick={renderProps.onClick}
                type="button"
                className={stylesModule['button-login']}
              >
                Login FB
              </button>
            )}
          />
        </div>
      )}
      <Form>
        <Pane className={classnames(stylesModule['main-container'])}>
          <div className="row">
            <div className={classnames(stylesModule['main-title'], 'col-lg-12')}>
              {user?.picture?.data?.url && (
                <img src={user?.picture?.data?.url} alt="facebook" className={stylesModule.img} />
              )}
              <div className={stylesModule['main-title-right']}>
                <h3 className={stylesModule.name}>{user?.name}</h3>
                <p className={stylesModule.title}>Chỉ định cuộc trò chuyện</p>
              </div>
            </div>
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={100}
              autoHeight
              autoHeightMax="calc(100vh - 270px)"
              className={stylesModule['main-contents']}
            >
              <div className={classnames(stylesModule['main-contents-day'], 'col-lg-12')}>
                <p className={stylesModule.title}>Chủ nhật, 31/05/2021</p>
              </div>

              <div>
                <div className={classnames(stylesModule['main-left-contents'], 'col-lg-12')}>
                  <p className={stylesModule.content}>
                    Chào em, chị đang cần hỏi em về vài vấn đề liên quan đến học phí và chương trình
                    học của bé Nguyễn Bảo Nam. Em xem file sau.
                  </p>
                </div>

                <div className={classnames(stylesModule['left-file'], 'col-lg-12')}>
                  <div className={stylesModule['main-file']}>
                    <img
                      src="/images/facebook/messagesFile.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <div className={stylesModule.main}>
                      <h3 className={stylesModule.name}>be-nam.doc</h3>
                      <h4 className={stylesModule.content}> 1.2 MB Image File</h4>
                    </div>
                    <span className="icon-arrow-down2"> </span>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-img'], 'col-lg-12')}>
                  <div className={stylesModule['main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                  </div>
                  <div className={stylesModule['main-img']}>
                    <img
                      src="/images/facebook/messages02.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                  </div>
                  <div className={stylesModule['main-img']}>
                    <img
                      src="/images/facebook/messages03.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                  </div>
                </div>

                <div className={classnames(stylesModule['main-left-contents-time'], 'col-lg-12')}>
                  <p>10:00</p>
                </div>
              </div>

              <div>
                <div className={classnames(stylesModule['main-contents-right'], 'col-lg-12')}>
                  <p className={stylesModule.content}>
                    Chào em, chị đang cần hỏi em về vài vấn đề liên quan đến học phí và chương trình
                    học của bé Nguyễn Bảo Nam. Em xem file sau.
                  </p>
                </div>

                <div className={classnames(stylesModule['right-img'], 'col-lg-12')}>
                  <div className={stylesModule['main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                  </div>
                  <div className={stylesModule['main-img']}>
                    <img
                      src="/images/facebook/messages02.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                  </div>
                  <div className={stylesModule['main-img']}>
                    <img
                      src="/images/facebook/messages03.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                  </div>
                </div>
                <div className={classnames(stylesModule['main-contents-time-right'], 'col-lg-12')}>
                  <p className={stylesModule.time}>10:01</p>
                  <span className="icon-check-circle"> </span>
                </div>
              </div>

              <div className={classnames(stylesModule['main-contents-day'], 'col-lg-12')}>
                <p className={stylesModule.title}>Hôm nay</p>
              </div>

              <div>
                <div className={classnames(stylesModule['main-left-contents'], 'col-lg-12')}>
                  <p className={stylesModule.content}>
                    Mình cần biết về mức học phí tháng này của bé
                  </p>
                </div>

                <div className={classnames(stylesModule['main-left-contents-time'], 'col-lg-12')}>
                  <p>21:00</p>
                </div>
              </div>
            </Scrollbars>
            <div className={classnames(stylesModule['main-input'], 'col-lg-12')}>
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 3 }} placeholder="Nhập tin nhắn" />
              <div className={stylesModule.icon}>
                <Upload className={stylesModule['btn-Upload']}>
                  <span className="icon-attachment"> </span>
                </Upload>
                <Upload className={stylesModule['btn-Upload']}>
                  <span className="icon-smile"> </span>
                </Upload>
                <Upload className={stylesModule['btn-Upload']}>
                  <span className="icon-image"> </span>
                </Upload>
              </div>
            </div>
          </div>
        </Pane>
      </Form>
    </>
  );
});

export default Index;
