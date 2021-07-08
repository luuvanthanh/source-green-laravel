import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Modal, Form } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import moment from 'moment';

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
const mapStateToProps = ({ survey, loading }) => ({
  data: survey.data,
  pagination: survey.pagination,
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
      search: {
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      objects: {},
    };
    setIsMounted(true);
  }

  // componentDidMount() {
  //   this.onLoad();
  // }

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
   * Function load data
   */
  onLoad = () => {
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'survey/GET_DATA',
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
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearch = debounce((value, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [`${type}`]: value,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => this.onLoad(),
    );
  }, 300);

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChange = (e, type) => {
    this.debouncedSearch(e.target.value, type);
  };

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  changePagination = ({ page, limit }) => {
    this.setState(
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
  pagination = (pagination) => {
    const {
      location: { query },
    } = this.props;
    return Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        this.changePagination(response);
      },
    });
  };

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
   * Function close modal
   */
  handleCancel = () => {
    this.setStateData({ visible: false });
    this.onResetForm();
  };

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  onFinish = () => {
    const { objects } = this.state;
    this.formRef.current.validateFields().then((values) => {
      this.props.dispatch({
        type: !isEmpty(objects) ? 'survey/UPDATE' : 'survey/ADD',
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
          ...objects,
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
          type: 'survey/REMOVE',
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
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'TÊN KHẢO SÁT',
        key: 'name',
        className: 'min-width-150',
        render: () => <Text size="normal">Khảo sát phụ huynh</Text>,
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="primary" icon="edit" onClick={() => this.onEdit(record)} />
            <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const loading = effects['survey/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách khảo sát" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className={styles.search}>
            <Form
              initialValues={{
                ...search,
                productType: search.productType || null,
                startDate: search.startDate && moment(search.startDate),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    label="TÌM KIẾM"
                    name="keyWord"
                    onChange={(event) => this.onChange(event, 'keyWord')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
              </div>
            </Form>
          </div>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">DANH SÁCH KHẢO SÁT</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={[{ id: 1 }]}
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
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
