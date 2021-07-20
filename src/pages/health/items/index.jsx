import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, get } from 'lodash';
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
const mapStateToProps = ({ health, loading }) => ({
  loading,
  data: health.data,
  pagination: health.pagination,
  branches: health.branches,
  classes: health.classes,
  criteriaGroupProperties: health.criteriaGroupProperties,
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
        branchId: query.branchId,
        classId: query.classId,
        reportDate: moment().format(variables.DATE_FORMAT.DATE_AFTER),
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        keyWord: query?.keyWord,
      },
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
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'health/GET_DATA',
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
   * Function load data
   */
  loadCategories = () => {
    const { search } = this.state;
    if (search.branchId) {
      this.props.dispatch({
        type: 'health/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    this.props.dispatch({
      type: 'health/GET_BRANCHES',
      payload: {},
    });
    this.props.dispatch({
      type: 'health/GET_CRITERIA_GROUP_PROPERTIES',
      payload: {},
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'health/GET_CLASSES',
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

  getStudentCriteria = (items, key) => {
    if (items) {
      const itemCriteria = items.find((item) => item?.criteriaGroupProperty?.id === key);
      return itemCriteria?.value;
    }
    return null;
  };

  /**
   * Function header table
   */
  header = () => {
    const { criteriaGroupProperties } = this.props;
    const columns = [
      {
        title: 'Cơ sở',
        key: 'branch',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{get(record, 'student.class.branch.name')}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        render: (record) => <Text size="normal">{get(record, 'student.class.name')}</Text>,
      },
      {
        title: 'Họ và Tên',
        key: 'name',
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record?.student?.fileImage)}
            fullName={record?.student?.fullName}
          />
        ),
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
              onClick={() =>
                history.push(
                  `/suc-khoe/hom-nay/${record?.student?.id}/chi-tiet?reportDate=${get(
                    record,
                    'studentCriterias[0].reportDate',
                  )}&studentId=${record?.student?.id}`,
                )
              }
            >
              Chi tiết
            </Button>
          </div>
        ),
      },
    ];
    const columnsCategories = criteriaGroupProperties.map((item) => ({
      title: item.property,
      key: item.property,
      className: 'min-width-150',
      render: (record) => (
        <Text size="normal">{this.getStudentCriteria(record.studentCriterias, item.id)}</Text>
      ),
    }));
    return [...columns.slice(0, 3), ...columnsCategories, ...columns.slice(3)];
  };

  render() {
    const {
      branches,
      classes,
      data,
      pagination,
      match: { params },
      loading: { effects },
      location: { pathname },
    } = this.props;
    const { search } = this.state;
    const loading = effects['health/GET_DATA'];
    return (
      <>
        <Helmet title="Sức khỏe hôm nay" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">
              Sức khỏe hôm nay - Ngày {Helper.getDate(moment(), variables.DATE_FORMAT.DATE)}
            </Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Tạo mới sức khỏe
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                classId: search.classId || null,
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
                    data={[{ id: null, name: 'Chọn tất cả cơ sở' }, ...branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    data={[{ id: null, name: 'Chọn tất cả lớp' }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
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
              bordered={false}
              rowKey={(record) => record.id || record?.student?.id}
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
  criteriaGroupProperties: PropTypes.arrayOf(PropTypes.any),
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
  criteriaGroupProperties: [],
  branches: [],
  classes: [],
};

export default Index;
