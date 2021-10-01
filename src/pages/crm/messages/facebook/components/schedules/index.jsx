import React, { PureComponent } from 'react';
import { Modal, Form } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';
import Quill from '@/components/CommonComponent/Quill';

import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ crmSaleCheck, loading }) => ({
  loading,
  categories: crmSaleCheck.categories,
  details: crmSaleCheck.details,
  branches: crmSaleCheck.branches,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleOk = () => {
    history.push('/crm/sale/ph-lead/trung');
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { isModalVisible } = this.state;
    return (
      <>
        <div>
          <Button
            color="white"
            icon="schedules"
            size="normal"
            className={stylesModule['button-contact']}
            onClick={this.showModal}
          />
          <Modal
            title="Thêm cuộc hẹn"
            className={stylesModule['wrapper-modal']}
            centered
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={['50%']}
            footer={[
              <p
                key="back"
                role="presentation"
                onClick={this.handleCancel}
                className={stylesModule['button-cancel']}
              >
                Hủy
              </p>,
              <Button key="submit" color="success" type="primary" onClick={this.handleOk}>
                Lưu
              </Button>,
            ]}
          >
            <div>
              <Form className={styles['layout-form']} layout="vertical">
                <Pane>
                  <Pane>
                    <div className="row">
                      <Pane className="col-lg-12">
                        <FormItem name="name" label="Tên sự kiện" type={variables.INPUT} />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          name="day"
                          label="Ngày diễn ra"
                          type={variables.DATE_PICKER}
                          disabledDate={(current) => current > moment()}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          name="time"
                          label="Giờ diễn ra"
                          type={variables.TIME_PICKER}
                          disabledDate={(current) => current > moment()}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem name="name" label="Địa điểm" type={variables.INPUT} />
                      </Pane>
                      <Pane className="col-lg-12">
                        <div className="ant-col ant-form-item-label">
                          <label>
                            <span>Nội dung</span>
                          </label>
                        </div>
                        <Quill />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem name="name" label="Ghi chú" type={variables.INPUT} />
                      </Pane>
                    </div>
                  </Pane>
                </Pane>
              </Form>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

export default Index;
