import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tabs } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import ability from '@/utils/ability';
import variablesModules from '../utils/variables';

const { TabPane } = Tabs;
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
const mapStateToProps = ({ curriculumTemplates, loading }) => ({
  loading,
  error: curriculumTemplates.error,
  data: curriculumTemplates.data,
  pagination: curriculumTemplates.pagination,
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
        programType: query?.programType,
        fromDate: query?.fromDate
          ? moment(query?.fromDate).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().startOf('months'),
        toDate: query?.toDate
          ? moment(query?.toDate).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().endOf('months'),
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        isEnd: query?.isEnd || false,
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
      type: 'curriculumTemplates/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        fromDate: Helper.getDate(search.fromDate, variables.DATE_FORMAT.DATE_AFTER),
        toDate: Helper.getDate(search.toDate, variables.DATE_FORMAT.DATE_AFTER),
      }),
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
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => this.onLoad(),
    );
  }, 200);

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
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'curriculumTemplates/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

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
   * Function header table
   */
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'STT',
        key: 'index',
        align: 'center',
        className: 'min-width-60',
        width: 60,
        render: (text, record, index) =>
          `CT${Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit)}`,
      },
      {
        title: 'Tên chương trình',
        key: 'title',
        width: 180,
        className: 'min-width-180',
        render: (record) => <Text size="normal">{record?.name}</Text>,
      },
      {
        title: 'Loại chương trình',
        key: 'life',
        width: 180,
        className: 'min-width-180',
        render: (record) => (
          <Text size="normal">{variablesModules.PROGRAM_TYPE[record?.programType]}</Text>
        ),
      },
      {
        title: 'Thời gian áp dụng',
        key: 'creationTime',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record.fromDate, variables.DATE_FORMAT.DATE_AFTER)} -{' '}
            {Helper.getDate(record.toDate, variables.DATE_FORMAT.DATE_AFTER)}
          </Text>
        ),
      },
      {
        key: 'actions',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
              permission="CTH"
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return !ability.can('CTH', 'CTH') ? columns.filter((item) => item.key !== 'actions') : columns;
  };

  render() {
    const {
      error,
      data,
      pagination,
      match: { params },
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const loading = effects['curriculumTemplates/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách template" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách template</Text>
            <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/them-moi`)}
              permission="CTH"
            >
              Tạo mới
            </Button>
          </div>
          <div className={classnames(styles['block-table'], styles['block-table-tab'])}>
            <Tabs
              defaultActiveKey={search?.isEnd || false}
              onChange={(event) => this.onChangeSelectStatus(event, 'isEnd')}
            >
              {variablesModules.STATUS_TABS.map((item) => (
                <TabPane tab={item.name} key={item.id} />
              ))}
            </Tabs>
            <Form
              initialValues={{
                ...search,
                programType: search.programType || null,
                date: search.fromDate &&
                  search.toDate && [moment(search.fromDate), moment(search.toDate)],
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="keyWord"
                    onChange={(event) => this.onChange(event, 'keyWord')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="programType"
                    data={[
                      {
                        id: null,
                        name: 'Chọn tất cả',
                      },
                      ...variablesModules.RADIOS.map((item) => ({
                        id: item.value,
                        name: item.label,
                      })),
                    ]}
                    type={variables.SELECT}
                    onChange={(event) => this.onChangeSelect(event, 'programType')}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={data}
              error={error}
              isError={error.isError}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              onRow={(record) => ({
                onClick: () => {
                  if (ability.can('CTH', 'CTH')) {
                    history.push(`/chuong-trinh-hoc/templates/${record.id}/chi-tiet`);
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
