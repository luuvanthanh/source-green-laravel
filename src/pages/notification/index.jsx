import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import ability from '@/utils/ability';

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
const mapStateToProps = ({ notifications, loading }) => ({
  data: notifications.data,
  pagination: notifications.pagination,
  error: notifications.error,
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
        keyWord: query?.keyWord,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        fromDate: query?.fromDate
          ? moment(query?.fromDate).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
        toDate: query?.toDate
          ? moment(query?.toDate).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
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
      type: 'notifications/GET_DATA',
      payload: {
        ...search,
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
        },
      }),
      () => this.onLoad(),
    );
  }, 300);

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchStatus = debounce((value, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [`${type}`]: value,
        },
      }),
      () => this.onLoad(),
    );
  }, 200);

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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectStatus = (e, type) => {
    this.debouncedSearchStatus(e, type);
  };

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchDateRank = debounce((fromDate, toDate) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          fromDate,
          toDate,
        },
      }),
      () => this.onLoad(),
    );
  }, 200);

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDateRank = (e) => {
    this.debouncedSearchDateRank(
      moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
    );
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
   * Function remove items
   * @param {uid} id id of items
   */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'notifications/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) self.onLoad();
          },
        });
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'Mã ID',
        key: 'index',
        align: 'center',
        className: 'min-width-80',
        width: 80,
        render: (text, record, index) =>
          `TB${Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit)}`,
      },
      {
        title: 'Thời gian gửi',
        key: 'sentDate',
        className: 'min-width-180',
        width: 180,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record.sentDate, variables.DATE_FORMAT.DATE_TIME)}
          </Text>
        ),
      },
      {
        title: 'Người gửi',
        key: 'sender',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">{record?.sender?.objectInfo?.fullName || record?.sender?.name}</Text>
        ),
      },
      {
        title: 'Tiêu đề',
        key: 'title',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record.title}</Text>,
      },
      {
        title: 'Nội dung',
        key: 'content',
        className: 'min-width-200',
        render: (record) => (
          <div
            style={{ maxHeight: '100px', overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: record.content }}
          />
        ),
      },
      {
        key: 'actions',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={(event) => {
                event.stopPropagation();
                history.push(`/thong-bao/${record.id}/chinh-sua`);
              }}
              permission="THONGBAO"
            />
            <Button
              color="danger"
              icon="remove"
              onClick={(event) => {
                event.stopPropagation();
                this.onRemove(record.id);
              }}
              permission="THONGBAO"
            />
          </div>
        ),
      },
    ];
    return !ability.can('THONGBAO', 'THONGBAO') && !ability.can('THONGBAO', 'THONGBAO')
      ? columns.filter((item) => item.key !== 'actions')
      : columns;
  };

  render() {
    const {
      data,
      error,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['notifications/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách thông báo" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách thông báo</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`/thong-bao/tao-moi`)}
              permission="THONGBAO"
            >
              Tạo thông báo
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.fromDate &&
                  search.toDate && [moment(search.fromDate), moment(search.toDate)],
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="keyWord"
                    onChange={(event) => this.onChange(event, 'keyWord')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              error={error}
              isError={error.isError}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              onRow={(record) => ({
                onClick: () => {
                  if (ability.can('THONGBAO', 'THONGBAO')) {
                    history.push(`/thong-bao/${record.id}/chi-tiet`);
                  }
                },
              })}
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
