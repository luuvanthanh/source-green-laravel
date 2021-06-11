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
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import ability from '@/utils/ability';
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
const mapStateToProps = ({ OPchildren, loading }) => ({
  loading,
  data: OPchildren.data,
  classes: OPchildren.classes,
  branches: OPchildren.branches,
  pagination: OPchildren.pagination,
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
        keyWord: query?.keyWord,
        class: query?.class,
        branchId: query?.branchId,
        classStatus: 'ALL',
        isStoreStaus: false,
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
   * Function load data
   */
  onLoad = () => {
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'OPchildren/GET_DATA',
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
   * Function get list students
   */
  loadBranches = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'OPchildren/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'OPchildren/GET_BRANCHES',
      payload: {},
    });
  };

  onChangeBranch = (branch) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'OPchildren/GET_CLASSES',
      payload: {
        branch,
      },
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
      type: 'OPchildren/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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
    const columns = [
      {
        title: 'Mã ID',
        key: 'index',
        className: 'min-width-70',
        width: 70,
        align: 'center',
        render: (text, record, index) => `HS${Helper.serialOrder(this.state.search?.page, index)}`,
      },
      {
        title: 'Họ và Tên',
        key: 'name',
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
            fullName={record.fullName}
          />
        ),
      },
      {
        title: 'Tuổi (tháng)',
        key: 'age',
        className: 'min-width-150',
        align: 'center',
        render: (record) => <Text size="normal">{record.age}</Text>,
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.class?.branch?.name}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{record?.class?.name}</Text>,
      },
      {
        title: 'Ngày vào lớp',
        key: 'date',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(record.registerDate, variables.DATE_FORMAT.DATE)}
          </Text>
        ),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        className: 'min-width-150',
        render: (record) => HelperModules.tagStatus(record.status),
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
              ghost
              onClick={() => history.push(`/ho-so-doi-tuong/hoc-sinh/${record.id}/chi-tiet`)}
              permission="HSDT_HS_XEM"
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return !ability.can('HSDT_HS_XEM', 'HSDT_HS_XEM')
      ? columns.filter((item) => item.key !== 'actions')
      : columns;
  };

  render() {
    const {
      data,
      branches,
      classes,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search } = this.state;
    const loading = effects['OPchildren/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách học sinh" />
        <div
          className={classnames(styles['content-form'], styles['content-form-children'], 'pb30')}
        >
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Học sinh</Text>
            <Button
              color="success"
              icon="plus"
              permission="HSDT_HS_THEM"
              onClick={() => history.push(`/ho-so-doi-tuong/hoc-sinh/tao-moi`)}
            >
              Tạo hồ sơ
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                startDate: search.startDate && moment(search.startDate),
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
                    data={branches}
                    name="branchId"
                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={classes}
                    name="class"
                    onChange={(event) => this.onChangeSelect(event, 'class')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeDate(event, 'startDate')}
                    type={variables.DATE_PICKER}
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              onRow={(record) => ({
                onClick: () => {
                  if (ability.can('HSDT_HS_XEM', 'HSDT_HS_XEM')) {
                    history.push(`/ho-so-doi-tuong/hoc-sinh/${record.id}/chi-tiet`);
                  }
                },
              })}
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
