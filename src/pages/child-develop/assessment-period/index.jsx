import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Switch } from 'antd';
import { debounce } from 'lodash';
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
const mapStateToProps = ({ childDevelopAssessmentPeriod, loading }) => ({
  data: childDevelopAssessmentPeriod.data,
  error: childDevelopAssessmentPeriod.error,
  pagination: childDevelopAssessmentPeriod.pagination,
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
        key: query?.key,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
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
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'childDevelopAssessmentPeriod/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
        },
        variables.QUERY_STRING,
      )}`,
    );
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
  pagination = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        this.changePagination(response);
      },
    });

  /**
 * Function remove items
 * @param {uid} id id of items
 */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'childDevelopAssessmentPeriod/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              self.onLoad();
            }
          },
        });
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 100,
        className: 'min-width-100',
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Mã kì',
        key: 'code',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record.code}</Text>,
      },
      {
        title: 'Tên kì đánh giá',
        key: 'name',
        width: 250,
        className: 'min-width-250',
        render: (record) => <Text size="normal">{record.name}</Text>,
      },
      {
        title: 'Năm học',
        key: 'date',
        width: 150,
        className: 'min-width-150',
        render: (record) => `${record?.schoolYear?.yearFrom || ''} - ${record?.schoolYear?.yearTo || ''}`
      },
      {
        title: 'Thời gian đánh giá',
        key: 'time',
        width: 250,
        className: 'min-width-250',
        render: (record) => record?.schoolYear
          ? `${Helper.getDate(record?.startDate, variables.DATE_FORMAT.DATE_VI)} - ${Helper.getDate(record?.endDate, variables.DATE_FORMAT.DATE_VI)}` : ''
      },
      {
        title: 'Sử dụng',
        dataIndex: 'use',
        width: 150,
        className: 'min-width-150',
        render: (use,record) => (
          <div
            role="presentation"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Switch
              defaultChecked={use}
              onChange={() => {
                const payload = {
                  id: record?.id,
                  use: !use,
                };
                this.props.dispatch({
                  type: 'childDevelopAssessmentPeriodAdd/UPDATE',
                  payload,
                  callback: (response) => {
                    if (response) {
                      this.onLoad();
                    }
                  },
                });
              }}
            />
          </div>
        ),
      },
      {
        key: 'action',
        width: 125,
        fixed: 'right',
        className: 'min-width-125',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
            <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
          </div>
        ),
      },
    ];
    return columns;
  };

  render() {
    const {
      error,
      data,
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const loading = effects['childDevelopAssessmentPeriod/GET_DATA'];
    return (
      <>
        <Helmet title="Kì đánh giá" />
        <div className='pl20 pr20 pb20'>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Kì đánh giá</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="key"
                    onChange={(event) => this.onChange(event, 'key')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              error={error}
              isError={error.isError}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  error: {},
};

export default Index;
