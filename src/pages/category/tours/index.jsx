import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Modal, Form, Switch } from 'antd';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import PropTypes from 'prop-types';

const mapStateToProps = ({ categoryTours, loading }) => ({
  data: categoryTours.data,
  pagination: categoryTours.pagination,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.onLoad();
  }

  /**
   * Function load data
   * @param {function} dispatch Call effects model login
   */
  onLoad = () => {
    this.props.dispatch({
      type: 'categoryTours/GET_DATA',
      payload: {},
    });
  };

  /**
   * Function pagination table
   * @param {object} pagination data of table
   */
  pagination = (pagination) => ({
    size: 'default',
    total: pagination.total,
    pageSize: 10,
    defaultCurrent: 1,
    hideOnSinglePage: true,
    showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong ${total}`,
  });

  /**
   * Function reset form
   */
  onResetForm = () => {
    if (this.formRef) {
      this.formRef.current.resetFields();
    }
  };

  /**
   * Function open modal
   */
  handleOk = () => {
    this.setState({ visible: false });
  };

  /**
   * Function close modal
   */
  handleCancel = () => {
    this.setState({ visible: false });
    this.onResetForm();
  };

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  onFinish = () => {
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: 'categoryTours/ADD',
        payload: {
          ...values,
        },
        callback: () => {},
      });
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'index',
        className: 'min-width-60',
        width: 60,
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'TÊN',
        key: 'name',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.name}</Text>,
      },
      {
        title: 'HÃNG HÀNG KHÔNG',
        key: 'airlines',
        className: 'min-width-180',
        render: (record) => <Text size="normal">{record.airlines}</Text>,
      },
      {
        title: 'LOẠI HÌNH DU LỊCH',
        key: 'type',
        className: 'min-width-170',
        width: 170,
        render: (record) => <Text size="normal">{record.type}</Text>,
      },
      {
        title: 'ĐIỂM KHỞI HÀNH',
        key: 'location',
        className: 'min-width-170',
        width: 170,
        render: (record) => <Text size="normal">{record.location}</Text>,
      },
      {
        title: 'LOẠI KHÁCH TOUR',
        key: 'customer',
        className: 'min-width-170',
        width: 170,
        render: (record) => <Text size="normal">{record?.customer?.name}</Text>,
      },
      {
        title: 'KÍCH HOẠT',
        key: 'isActive',
        className: 'min-width-120',
        width: 120,
        align: 'center',
        render: (record) => <Switch checked={record.isActive} />,
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: () => (
          <div className={styles['list-button']}>
            <Button color="primary" icon="edit" />
            <Button color="danger" icon="remove" />
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
      pagination,
      loading: { effects },
    } = this.props;
    const loading = effects['categoryTours/GET_DATA'];
    const loadingSubmit = effects['categoryTours/ADD'];
    return (
      <div className={styles['layout-form']}>
        <Helmet title="Danh mục tour" />
        <Modal
          centered
          footer={[
            <div className={classnames('d-flex', 'justify-content-end')} key="action">
              <Button
                color="white"
                icon="cross"
                loading={loadingSubmit}
                onClick={this.handleCancel}
                size="medium"
              >
                HỦY
              </Button>
              <Button
                color="green"
                icon="save"
                loading={loadingSubmit}
                onClick={this.onFinish}
                size="medium"
              >
                LƯU
              </Button>
            </div>,
          ]}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          title="THÊM MỚI TOUR"
          visible={this.state.visible}
        >
          <Form layout="vertical" ref={this.formRef}>
            <div className="row">
              <div className="col-lg-12">
                <FormItem
                  label="TÊN"
                  name="name"
                  rules={[variables.RULES.EMPTY_INPUT]}
                  type={variables.INPUT}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <FormItem
                  label="HÃNG SÂN BAY"
                  name="airlines"
                  rules={[variables.RULES.EMPTY_INPUT]}
                  type={variables.INPUT}
                />
              </div>
              <div className="col-lg-6">
                <FormItem
                  data={[{ id: 'all', name: 'Tất cả loại' }]}
                  label="LOẠI HÌNH DU LỊCH"
                  name="type"
                  rules={[variables.RULES.EMPTY]}
                  type={variables.SELECT}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <FormItem
                  label="ĐIỂM KHỞI HÀNH"
                  name="location"
                  rules={[variables.RULES.EMPTY_INPUT]}
                  type={variables.INPUT}
                />
              </div>
              <div className="col-lg-6">
                <FormItem
                  data={[{ id: 'all', name: 'Tất cả loại' }]}
                  label="LOẠI KHÁCH TOUR"
                  name="customer"
                  rules={[variables.RULES.EMPTY]}
                  type={variables.SELECT}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <FormItem
                  className="mb-0"
                  label="KÍCH HOẠT"
                  name="isActive"
                  type={variables.SWITCH}
                />
              </div>
            </div>
          </Form>
        </Modal>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">DANH MỤC TOUR</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() =>
                this.setState({
                  visible: true,
                })
              }
            >
              Thêm mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </div>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
};

export default Index;
