import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form } from 'antd';
import classnames from 'classnames';
import { isEmpty, head } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';

let isMounted = true;
/**
 * Set isMounted
 * @param {boolean} value
 * @returns {boolean} value of isMounted
 */
const setIsMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};
/**
 * Get isMounted
 * @returns {boolean} value of isMounted
 */
const getIsMounted = () => isMounted;
const { confirm } = Modal;
const mapStateToProps = ({ services, loading }) => ({
  data: services.data,
  pagination: services.pagination,
  categories: services.categories,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      visible: false,
      search: {
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.SIZEMAX,
      },
      objects: {},
      expandedRowKeys: [],
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
    this.loadCategories();
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  /**
   * Set state properties
   * @param {object} data the data input
   * @param {function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof setStateData
   */
  setStateData = (state, callback) => {
    if (!getIsMounted()) {
      return;
    }
    this.setState(state, callback);
  };

  /**
   * Function get categories
   */
  loadCategories = () => {
    this.props.dispatch({
      type: 'services/GET_CATEGORIES',
    });
  };

  /**
   * Function load data
   */
  onLoad = () => {
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'services/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  changePagination = (page, limit) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          page,
          limit,
        },
      }),
      () => {
        this.onLoad();
      },
    );
  };

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  pagination = (pagination) => ({
    size: 'default',
    total: pagination.total,
    pageSize: variables.PAGINATION.PAGE_SIZE,
    defaultCurrent: Number(this.state.search.page),
    current: Number(this.state.search.page),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: false,
    pageSizeOptions: false,
    onChange: (page, size) => {
      this.changePagination(page, size);
    },
  });

  /**
   * Function reset form
   */
  onResetForm = () => {
    if (this.formRef) {
      this.formRef.current.resetFields();
      this.setStateData({
        objects: {},
      });
    }
  };

  /**
   * Function open modal
   */
  handleOk = () => {
    this.setStateData({ visible: false });
  };

  /**
   * Function close modal
   */
  handleCancel = () => {
    this.setStateData({ visible: false, action: null, target: null });
    this.onResetForm();
  };

  /**
   * Function expand table mutilple level
   * @param {bool} expanded values of form
   * @param {object} record item of table
   */
  onExpand = (expanded, record) => {
    if (expanded) {
      return this.setStateData((prevState) => ({
        expandedRowKeys: !isEmpty(prevState.expandedRowKeys)
          ? [...prevState.expandedRowKeys, record.businessObjectGroup.id]
          : [record.businessObjectGroup.id],
      }));
    }
    return this.setStateData((prevState) => ({
      expandedRowKeys: !isEmpty(prevState.expandedRowKeys)
        ? prevState.expandedRowKeys.filter((item) => item !== record.businessObjectGroup.id)
        : [record.businessObjectGroup.id],
    }));
  };

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  onFinish = () => {
    const { objects } = this.state;
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: !isEmpty(objects) ? 'services/UPDATE' : 'services/ADD',
        payload: {
          ...values,
          id: objects.id,
        },
        callback: (response, error) => {
          if (response) {
            this.handleCancel();
            this.onLoad();
          }
          if (error) {
            if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
              error?.validationErrors.forEach((item) => {
                this.formRef.current.setFields([
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
    });
  };

  /**
   * Function remove items
   * @param {objects} record value of items
   */
  onEdit = (objects) => {
    this.setStateData(
      {
        objects,
        visible: true,
      },
      () => {
        this.formRef.current.setFieldsValue({
          businessObjectGroupId: objects?.businessObjectGroupId,
          name: objects?.name,
        });
      },
    );
  };

  /**
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        dispatch({
          type: 'services/REMOVE',
          payload: {
            id,
            pagination: {
              limit: search.limit,
              page: search.page,
            },
          },
        });
      },
      onCancel() {},
    });
  };

  onAddLocation = (record) => {
    this.setStateData(
      {
        visible: true,
      },
      () => {
        this.formRef.current.setFieldsValue({
          businessObjectGroupId: record.id,
        });
      },
    );
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
      },
      {
        title: 'TÊN',
        key: 'name',
        className: 'min-width-150',
        render: (record) => (
          <Text className={record?.businessObjectGroup?.name ? 'text-uppercase' : ''} size="normal">
            {record?.businessObjectGroup?.name || record.name}
          </Text>
        ),
      },
      {
        key: 'action',
        className: 'min-width-130',
        width: 130,
        render: (record) => (
          <div className={classnames(styles['list-button'], 'justify-content-end')}>
            {!isEmpty(record.businessObjectGroupServices) && (
              <Button
                color="success"
                icon="plusMain"
                onClick={() => this.onAddLocation(record.businessObjectGroup)}
              />
            )}
            {isEmpty(record.businessObjectGroupServices) && (
              <Button color="primary" icon="edit" onClick={() => this.onEdit(record)} />
            )}
            {isEmpty(record.businessObjectGroupServices) && (
              <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
            )}
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      data,
      match: { params },
      loading: { effects },
      categories,
    } = this.props;
    const { visible, objects, expandedRowKeys } = this.state;
    const loading = effects['services/GET_DATA'];
    const loadingSubmit = effects['services/ADD'] || effects['services/UPDATE'];
    return (
      <div className={styles['layout-form']}>
        <Helmet title="DANH MỤC LOẠI DỊCH VỤ" />
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
          title={isEmpty(objects) ? 'THÊM MỚI LOẠI DỊCH VỤ' : 'CHỈNH SỬA LOẠI DỊCH VỤ'}
          visible={visible}
        >
          <Form layout="vertical" ref={this.formRef}>
            <div className="row">
              <div className="col-lg-12">
                <FormItem
                  data={categories?.boGroups}
                  label="CHỌN NHÓM ĐỐI TƯỢNG"
                  name="businessObjectGroupId"
                  rules={[variables.RULES.EMPTY_INPUT]}
                  type={variables.SELECT}
                />
              </div>
              <div className="col-lg-12">
                <FormItem
                  label="TÊN LOẠI DỊCH VỤ"
                  name="name"
                  rules={[variables.RULES.EMPTY_INPUT]}
                  type={variables.INPUT}
                />
              </div>
            </div>
          </Form>
        </Modal>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">DANH MỤC LOẠI DỊCH VỤ</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() =>
                this.setStateData({
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
              childrenColumnName="businessObjectGroupServices"
              columns={this.header(params)}
              dataSource={data}
              expandedRowKeys={expandedRowKeys}
              loading={loading}
              onExpand={this.onExpand}
              pagination={false}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record?.businessObjectGroup?.id || record.id}
              scroll={{ x: '100%', y: '70vh' }}
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
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  loading: {},
  dispatch: {},
  location: {},
  categories: {},
};

export default Index;
