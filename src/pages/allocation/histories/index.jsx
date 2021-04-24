import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Typography, Form } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import HelperModules from '../utils/Helper';
import variablesModules from '../utils/variables';
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
const { Paragraph } = Typography;
const mapStateToProps = ({ AllocationHistories, loading }) => ({
  data: AllocationHistories.data,
  pagination: AllocationHistories.pagination,
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
        action: query?.action,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      objects: {},
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
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'AllocationHistories/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(`${pathname}?${Helper.convertParamSearchConvert(search, variables.QUERY_STRING)}`);
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  changePagination = (page, limit) => {
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
  pagination = (pagination) => ({
    size: 'default',
    total: pagination.total,
    pageSize: variables.PAGINATION.PAGE_SIZE,
    defaultCurrent: Number(this.state.search.page),
    current: Number(this.state.search.page),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      this.changePagination(page, size);
    },
    onShowSizeChange: (current, size) => {
      this.changePagination(current, size);
    },
    showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
  });

  /**
   * Function header table
   */
  header = () => {
    return [
      {
        title: 'Thời gian',
        key: 'code',
        width: 150,
        className: 'min-width-130',
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record.creationTime, variables.DATE_FORMAT.DATE_TIME)}
          </Text>
        ),
      },
      {
        title: 'Tên tài khoản',
        key: 'name',
        className: 'min-width-130',
        render: (record) => 'Nguyễn Ngọc Bích',
      },
      {
        title: 'Hành động',
        key: 'action',
        className: 'min-width-130',
        render: (record) => variablesModules.ACTION_TYPE[record.action],
      },
      {
        title: 'Nội dung',
        key: 'status',
        className: 'min-width-120',
        render: (record) => (
          <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}>
            {record.content}
          </Paragraph>
        ),
      },
    ];
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['AllocationHistories/GET_DATA'];
    return (
      <>
        <Helmet title="Lịch sử y tế" />
        <div
          className={classnames(styles['content-form'], styles['content-form-AllocationHistories'])}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Lịch sử</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="user_id"
                    data={[]}
                    onChange={(event) => this.onChangeSelect(event, 'user_id')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="action"
                    data={variablesModules.ACTION_TYPE_STATUS}
                    onChange={(event) => this.onChangeSelect(event, 'action')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeSelect(event, 'startDate')}
                    type={variables.DATE_PICKER}
                  />
                </div>
              </div>
            </Form>
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
              bordered={false}
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
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
