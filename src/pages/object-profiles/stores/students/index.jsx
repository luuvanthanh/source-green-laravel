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
import HelperModules from '../../utils/Helper';

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
const mapStateToProps = ({ storeStudents, loading, user }) => ({
  loading,
  data: storeStudents.data,
  classes: storeStudents.classes,
  branches: storeStudents.branches,
  pagination: storeStudents.pagination,
  defaultBranch: user.defaultBranch,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
      defaultBranch,
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        isStoreStaus: true,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        keyWord: query?.keyWord,
        class: query?.class,
        branchId: query?.branchId || defaultBranch?.id,
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
    const { dispatch, defaultBranch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'storeStudents/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      dispatch({
        type: 'storeStudents/GET_BRANCHES',
        payload: {},
      });
    }
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
      type: 'storeStudents/GET_DATA',
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'storeStudents/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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
        render: (text, record, index) =>
          `HS${Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit)}`,
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
        key: 'action',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="success"
              ghost
              onClick={() => history.push(`/ho-so-doi-tuong/hoc-sinh/${record.id}/chi-tiet`)}
              permission="HSDT"
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    return !ability.can('HSDT', 'HSDT')
      ? columns.filter((item) => item.key !== 'actions')
      : columns;
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
      branches,
      classes,
      defaultBranch,
    } = this.props;
    const { search, defaultBranchs } = this.state;
    const loading = effects['storeStudents/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách học sinh lưu trữ" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Học sinh</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                class: search.class || null,
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
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                      name="branchId"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      placeholder="Chọn cơ sở"
                      allowClear={false}
                    />
                  </div>
                )}
                {defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={defaultBranchs}
                      name="branchId"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      placeholder="Chọn cơ sở"
                      allowClear={false}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả lớp' }, ...classes]}
                    name="class"
                    onChange={(event) => this.onChangeSelect(event, 'class')}
                    type={variables.SELECT}
                    placeholder="Chọn lớp"
                    allowClear={false}
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
                  if (ability.can('HSDT', 'HSDT')) {
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
  defaultBranch: PropTypes.objectOf(PropTypes.any),
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
  defaultBranch: {},
};

export default Index;
