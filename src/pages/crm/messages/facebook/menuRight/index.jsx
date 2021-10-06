import React, { memo } from 'react';
import { useSelector } from 'dva';

import { Form, Input, Tag } from 'antd';
import classnames from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import { Scrollbars } from 'react-custom-scrollbars';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import stylesModule from '../styles.module.scss';
import HelperModules from '../utils/Helper';
import AddLead from '../components/add-lead';
import Email from '../components/email';
import Schedules from '../components/schedules';
import Work from '../components/work';

const Index = memo(() => {
  const { userCRM } = useSelector(({ userCRM }) => ({ userCRM }));

  return (
    <Scrollbars
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={100}
      autoHeight
      autoHeightMax="calc(100vh - 100px)"
    >
      <Form>
        <Pane className={classnames(stylesModule['right-container'])}>
          <div>
            <div className={classnames(stylesModule['right-button'], 'col-lg-12')}>
              <AddLead />
            </div>

            <div className={classnames(stylesModule['right-avt'], 'col-lg-12')}>
              {userCRM?.picture?.data?.url && (
                <img
                  src={userCRM?.picture?.data?.url}
                  alt="facebook"
                  className={stylesModule.img}
                />
              )}
            </div>
            <div className={classnames(stylesModule['right-name'], 'col-lg-12')}>
              {userCRM?.name}
            </div>

            <div className={classnames(stylesModule['right-status'])}>
              {HelperModules.tagStatus()}
            </div>

            <div className={classnames(stylesModule['right-contact'], 'col-lg-12')}>
              <Email />
              <Button
                color="white"
                icon="telephone"
                size="normal"
                className={stylesModule['button-contact']}
              />
              <Schedules />
              <Work />
            </div>

            <div className={classnames(stylesModule['right-information'])}>
              <div className="d-flex">
                <div className={classnames(stylesModule.title, 'col-lg-6')}>Ngày sinh</div>
                <div className={classnames(stylesModule.title, 'col-lg-6')}>30/09/2021</div>
              </div>
              <div className="d-flex">
                <div className={classnames(stylesModule.title, 'col-lg-6')}>Số điện thoại</div>
                <div className={classnames(stylesModule.title, 'col-lg-6')}>09661625154</div>
              </div>
              <div className="d-flex">
                <div className={classnames(stylesModule.title, 'col-lg-6')}>Email</div>
                <div className={classnames(stylesModule.title, 'col-lg-6')}>a@gmail.com</div>
              </div>
              <div className="d-flex">
                <div className={classnames(stylesModule.title, 'col-lg-6')}>Địa chỉ</div>
                <div className={classnames(stylesModule.title, 'col-lg-6')}>a</div>
              </div>
              <div className="d-flex">
                <div className={classnames(stylesModule.facebookName, 'col-lg-6')}>Facebook id</div>
                <div className={classnames(stylesModule.facebook, 'col-lg-6')}>http://...</div>
              </div>
            </div>

            <div className={classnames(stylesModule['right-tags'])}>
              <h3 className={stylesModule.title}>GẮN TAGS</h3>
              <div className={classnames(stylesModule['right-search'])}>
                <FormItem name="key" placeholder="Nhập từ khóa" type={variables.INPUT_SEARCH} />
              </div>
              <div className={stylesModule.body}>
                <Tag color="#f50" className="p5 m5" closable>
                  Không cung cấp TT
                </Tag>
                <Tag color="#2db7f5" className="p5 m5" closable>
                  Quan tâm khuyến mãi
                </Tag>
              </div>
            </div>
            <div className={classnames(stylesModule['right-note'])}>
              <h3 className={stylesModule.title}>GHI CHÚ</h3>
              <span className="icon-pencil"> </span>
            </div>
            <div className="p10 ">
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 3 }} placeholder="Nhập ghi chú" />
            </div>
          </div>
        </Pane>
      </Form>
    </Scrollbars>
  );
});

export default Index;
