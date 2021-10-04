import React, { PureComponent } from 'react';
import { Form } from 'antd';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import { Scrollbars } from 'react-custom-scrollbars';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import stylesModule from '../styles.module.scss';

class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      isActive: false,
    };
  }

  changeActive = () => {
    this.setState((prevState) => ({
      isActive: !prevState.isActive,
    }));
  };

  render() {
    const { isActive } = this.state;
    return (
      <>
        <Form>
          <Pane className={classnames(stylesModule['left-container'])}>
            <div>
              <div className={classnames(stylesModule['left-title'], 'col-lg-12')}>
                <img
                  src="/images/facebook/logoFacebook.svg"
                  alt="facebook"
                  className={stylesModule.img}
                />
                <p className={stylesModule.title}>Clover cơ sở 1</p>
              </div>
              <div>
                <div
                  className={classnames(stylesModule['left-search'], 'col-lg-12', {
                    [stylesModule.active]: isActive,
                  })}
                >
                  <FormItem
                    name="key"
                    placeholder="Tìm kiếm"
                    type={variables.INPUT_SEARCH}
                    className={stylesModule.search}
                  />
                  <Button
                    onClick={this.changeActive}
                    icon="equalizer"
                    className={stylesModule.button}
                  />
                </div>
                <div
                  className={classnames(stylesModule['left-search-model'], 'col-lg-12', {
                    [stylesModule.active]: isActive,
                  })}
                >
                  <span className={classnames(stylesModule['button-icon'], 'icon-price-tags')}> </span>
                  <span className={classnames(stylesModule['button-icon'], 'icon-user')}> </span>
                  <span className={classnames(stylesModule['button-icon'], 'icon-eye-blocked')}> </span>
                  <span className={classnames(stylesModule['button-icon'], 'icon-undo2')}> </span>
                  <span className={classnames(stylesModule['button-icon'], 'icon-phone1')}> </span>
                  <span className={classnames(stylesModule['button-icon'], 'icon-phone-off')}> </span>
                  <Button
                    onClick={this.changeActive}
                    icon="cancel"
                    className={stylesModule['button-icon-cancel']}
                  />
                </div>
              </div>
              <div className={classnames(stylesModule['left-title-time'], 'col-lg-12')}>
                <span>Gần đây</span>
              </div>
              <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={100}
                autoHeight
                autoHeightMax="calc(100vh - 250px)"
              >
                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của bé Nam là</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/avtFb01.svg"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Cảm ơn bạn nhiều!</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages02.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOff}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Cảm ơn bạn nhiều!.</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/avtFb01.svg"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOff}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Bạn ơi tình hình học của bé đang...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>

                <div className={classnames(stylesModule['left-main'], 'col-lg-12')}>
                  <div className={stylesModule['left-main-img']}>
                    <img
                      src="/images/facebook/messages01.png"
                      alt="facebook"
                      className={stylesModule.img}
                    />
                    <span className={stylesModule.radioOnl}> </span>
                  </div>
                  <div className={stylesModule['left-card-main']}>
                    <div className="d-flex justify-content-between">
                      <h3 className={stylesModule.name}>Trần Thị Ngọc Thư</h3>
                      <div className={stylesModule.time}>14:15</div>
                    </div>
                    <p className={stylesModule.title}>Vâng tiền học phí tháng này của...</p>
                  </div>
                </div>
              </Scrollbars>
            </div>
          </Pane>
        </Form>
      </>
    );
  }
}

export default Index;
