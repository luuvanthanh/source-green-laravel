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
            icon="file"
            size="normal"
            className={stylesModule['icon-contact']}
            onClick={this.showModal}
          />

          <Modal
            title="Thêm công việc"
            className={stylesModule['wrapper-modal']}
            centered
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={['50%']}
            height={800}
            footer={[
              <p
                key="back"
                role="presentation"
                onClick={this.handleCancel}
                className={stylesModule['wrapper-modal-cancel']}
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
                        <FormItem name="name" label="Tên công việc" type={variables.INPUT} />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem name="email" label="Loại công việc" type={variables.SELECT} />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem name="email" label="Người thực hiện" type={variables.SELECT} />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          name="day"
                          label="Ngày bắt đầu"
                          type={variables.DATE_PICKER}
                          disabledDate={(current) => current > moment()}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          name="day"
                          label="Ngày kết thúc"
                          type={variables.DATE_PICKER}
                          disabledDate={(current) => current > moment()}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <div className="ant-col ant-form-item-label">
                          <label>
                            <span>Nội dung công việc</span>
                          </label>
                        </div>
                        <Quill />
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
