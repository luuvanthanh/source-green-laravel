import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Avatar } from 'antd';
import classnames from 'classnames';
import { debounce, isEmpty, head } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Paragraph from '@/components/CommonComponent/Paragraph';
import HelperModules from '../utils/Helper';

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
const mapStateToProps = ({ inOutHistories, loading }) => ({
  data: inOutHistories.data,
  pagination: inOutHistories.pagination,
  classes: inOutHistories.classes,
  branches: inOutHistories.branches,
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
        nameStudent: query?.nameStudent,
        classId: query?.classId,
        branchId: query?.branchId,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        endDate: HelperModules.getEndDate(query?.endDate, query?.choose),
        startDate: HelperModules.getStartDate(query?.startDate, query?.choose),
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
    this.loadBranches();
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
   * Function get list students
   */
  loadBranches = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'inOutHistories/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'inOutHistories/GET_BRANCHES',
      payload: {},
    });
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
      type: 'inOutHistories/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          endDate: Helper.getDate(search.endDate, variables.DATE_FORMAT.DATE_AFTER),
          startDate: Helper.getDate(search.startDate, variables.DATE_FORMAT.DATE_AFTER),
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
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchDateRank = debounce((startDate, endDate) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          startDate,
          endDate,
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'inOutHistories/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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

  renderDescription = (record) => {
    if (!isEmpty(record)) {
      const inOutHistories = record.map(
        (item) => `${Helper.getDateLocal(item.attendedAt, variables.DATE_FORMAT.DATE_TIME)}`,
      );
      return (
        <Paragraph>
          {inOutHistories.map((item, index) => (
            <div key={index}>
              {item}
              <br />
            </div>
          ))}
        </Paragraph>
      );
    }
    return null;
  };

  /**
   * Function header table
   */
  header = () => [
    {
      title: 'STT',
      key: 'text',
      width: 50,
      align: 'center',
      render: (text, record, index) =>
        Helper.sttList(this.props.pagination?.current_page, index, this.props.pagination?.per_page),
    },
    {
      title: 'Họ và Tên',
      key: 'fullName',
      className: 'min-width-200',
      render: (record) => (
        <AvatarTable
          fileImage={Helper.getPathAvatarJson(record?.fileImage)}
          fullName={record?.fullName}
        />
      ),
    },
    {
      title: 'Hình chấm',
      key: 'inOutHistory',
      className: 'min-width-130',
      align: 'center',
      render: (record) => {
        if (!isEmpty(record?.inOutHistory)) {
          return <Avatar shape="square" size={80} src={head(record?.inOutHistory)?.fileImage} />;
        }
        return null;
      },
    },
    {
      title: 'Cơ sở',
      key: 'branch',
      className: 'min-width-130',
      width: 100,
      render: (record) => record?.classStudent?.class?.branch?.name,
    },
    {
      title: 'Lớp',
      key: 'class',
      className: 'min-width-130',
      width: 100,
      render: (record) => record?.classStudent?.class?.name,
    },
    {
      title: 'Số lần chấm',
      key: 'count',
      align: 'center',
      className: 'min-width-100',
      width: 100,
      render: (record) => record.inOutHistory?.length,
    },
    {
      title: 'Chi tiết',
      key: 'description',
      className: 'min-width-200',
      render: (record) => this.renderDescription(record.inOutHistory),
    },
  ];

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
      branches,
      classes,
    } = this.props;
    const { search } = this.state;
    const loading = effects['inOutHistories/GET_DATA'];
    return (
      <>
        <Helmet title="Lịch sử vào ra lớp" />
        <div className={classnames(styles['content-form'], styles['content-form-inOutHistories'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Lịch sử vào ra lớp</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.startDate &&
                  search.endDate && [moment(search.startDate), moment(search.endDate)],
                branchId: search.branchId || null,
                classId: search.classId || null,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="nameStudent"
                    onChange={(event) => this.onChange(event, 'nameStudent')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả lớp' }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    allowClear={false}
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
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  branches: [],
  classes: [],
};

export default Index;
