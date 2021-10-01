import React, { PureComponent } from 'react';
import { Modal, Select } from 'antd';
import { connect, history } from 'umi';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils';
import Pane from '@/components/CommonComponent/Pane';
import PropTypes from 'prop-types';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ menu, crmSaleAssignment, loading }) => ({
  loading,
  data: crmSaleAssignment.data,
  categories: crmSaleAssignment.categories,
  details: crmSaleAssignment.details,
  branches: crmSaleAssignment.branches,
  menuData: menu.menuLeftCRM,
});

const { Option } = Select;
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

  header = () => {
    const columns = [
      {
        title: 'Phụ huynh',
        key: 'name',
        className: 'max-width-150',
        width: 150,
        render: (record) => record?.name,
      },
      {
        title: 'Nhân viên chăm sóc',
        className: 'min-width-150',
        width: 150,
        key: 'group',
        render: () => (
          <Select placeholder="Chọn" style={{ width: '100%' }} mode="tags">
            <Option value="name01">Nguyễn Văn Nam</Option>
            <Option value="name02">Trần Anh Nhân</Option>
          </Select>
        ),
      },
    ];
    return columns;
  };

  render() {
    const { isModalVisible } = this.state;
    const {
      branches,
      match: { params },
      data,
      loading: { effects },
    } = this.props;
    const loading = effects['crmGroup/GET_DATA'];
    return (
      <>
        <div>
          <Button color="success" icon="list" className="ml-2" onClick={this.showModal}>
            Phân công
          </Button>
          <Modal
            title="Phân công nhân viên Sale"
            className={stylesModule['wrapper-modal']}
            centered
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={700}
            footer={[
              <p
                className={stylesModule['button-cancel']}
                key="back"
                role="presentation"
                onClick={this.handleCancel}
              >
                Hủy
              </p>,
              <Button
                key="submit"
                color="success"
                type="primary"
                onClick={this.handleOk}
                className={styles['cheack-btn-ok']}
              >
                Lưu
              </Button>,
            ]}
          >
            <div>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <span className={styles['assignment-title']}>Phân công</span>
                </Pane>
                <Pane className="col-lg-9">
                  <FormItem
                    className="mt-2"
                    name="name"
                    data={branches}
                    mode="tags"
                    type={variables.SELECT_MUTILPLE}
                  />
                </Pane>
                <Pane className={styles[('order-assignment-btn', 'col-lg-3')]}>
                  <Button
                    className="mt-2"
                    color="success"
                    style={{ backgroundColor: '#3B5CAD', border: 'none', borderRadius: '2px' }}
                  >
                    Áp dụng
                  </Button>
                </Pane>

                <div className="p15">
                  <Pane className={stylesModule['model-body col-lg-12']}>
                    <span className={styles['assignment-title']}>Nhân viên sale</span>
                    <Table
                      className="mt-2"
                      bordered={false}
                      columns={this.header(params)}
                      dataSource={data}
                      loading={loading}
                      pagination={false}
                      params={{
                        header: this.header(),
                        type: 'table',
                      }}
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
                    />
                  </Pane>
                </div>
              </Pane>
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  branches: [],
  data: [],
  loading: {},
};

export default Index;
