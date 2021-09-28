import React, { PureComponent } from 'react';
import { Modal, Radio } from 'antd';
import { connect } from 'umi';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import PropTypes from 'prop-types';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ crmSaleSelectionMerge, loading }) => ({
  data: crmSaleSelectionMerge.data,
  error: crmSaleSelectionMerge.error,
  pagination: crmSaleSelectionMerge.pagination,
  branches: crmSaleSelectionMerge.branches,
  loading,
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
    this.setState({ isModalVisible: false });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  /**
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'Mã phụ huynh ',
        key: 'code',
        width: 150,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.code}
          </div>
        ),
        fixed: 'left',
      },
      {
        title: 'Hình ảnh phụ huynh',
        key: 'img',
        width: 160,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.img}
          </div>
        ),
      },
      {
        title: 'Họ  và tên',
        key: 'name',
        width: 160,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.name}
          </div>
        ),
      },
      {
        title: 'Giới tính',
        key: 'sex',
        width: 150,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.sex}
          </div>
        ),
      },
      {
        title: 'Email',
        key: 'email',
        width: 170,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.email}
          </div>
        ),
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        width: 200,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.phone}
          </div>
        ),
      },
      {
        title: 'Số điện thoại khác',
        key: 'phone',
        width: 200,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.phone}
          </div>
        ),
      },
      {
        title: 'Địa chỉ',
        key: 'address',
        width: 200,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.address}
          </div>
        ),
      },
      {
        title: 'Quận Huyện',
        key: 'district',
        width: 170,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.district}
          </div>
        ),
      },
      {
        title: 'Tỉnh thành',
        key: 'city',
        width: 170,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Radio /> {record?.city}
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      match: { params },
      data,
    } = this.props;
    const { isModalVisible } = this.state;
    return (
      <>
        <div>
          <Button color="success" icon="shrink" className="ml-5" onClick={this.showModal}>
            Gộp dữ liệu
          </Button>
          <Modal
            title="Chọn gộp dữ liệu"
            className={stylesModule['wrapper-modal-selection']}
            centered
            visible={isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={['80%']}
            footer={[
              <Button color="yellow" icon="comeback" onClick={this.handleCancel} className="m15">
                Quay lại
              </Button>,
              <Button color="success" icon="shrink" onClick={this.handleOk} className="m15">
                Gộp dữ liệu
              </Button>,
            ]}
          >
            <div>
              <Table
                bordered
                columns={this.header(params)}
                dataSource={data}
                className="table-edit"
                pagination={false}
                params={{
                  header: this.header(),
                  type: 'table',
                }}
                rowKey={(record) => record.id}
                scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
              />
            </div>
          </Modal>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
};
export default Index;
