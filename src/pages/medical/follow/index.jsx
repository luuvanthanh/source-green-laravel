import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Modal } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Button from '@/components/CommonComponent/Button';
import variablesModules from '../utils/variables';
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
const mapStateToProps = ({ medicaFollow, loading }) => ({
  data: medicaFollow.data,
  branches: medicaFollow.branches,
  classes: medicaFollow.classes,
  pagination: medicaFollow.pagination,
  error: medicaFollow.error,
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
        diseaseName: query?.diseaseName,
        branchId: query?.branchId,
        status: query?.status || variablesModules.STATUS.PENDING,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        creationTimeFrom: Helper.getEndDate(query?.creationTimeFrom, query?.choose),
        creationTimeTo: Helper.getStartDate(query?.creationTimeTo, query?.choose),
      },
      visible: false,
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
      type: 'medicaFollow/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          creationTimeFrom: Helper.getDate(
            search.creationTimeFrom,
            variables.DATE_FORMAT.DATE_AFTER,
          ),
          creationTimeTo: Helper.getDate(search.creationTimeTo, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  /**
   * Function load branches
   */
  loadCategories = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'medicaFollow/GET_CLASSES',
        payload: search,
      });
    }
    dispatch({
      type: 'medicaFollow/GET_BRACHES',
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
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    const { dispatch } = this.props;
    this.debouncedSearch(e, type);
    dispatch({
      type: 'medicaFollow/GET_CLASSES',
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
  debouncedSearchDateRank = debounce((creationTimeFrom, creationTimeTo) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          creationTimeFrom,
          creationTimeTo,
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
   * Function header table
   */
  header = () => {
    const columnsMedical = variablesModules.TREE_MEDICAL.map((parent) => ({
      title: parent.label,
      key: parent.value,
      className: classnames(parent.color, 'parent'),
      children: parent?.children?.map((item) => ({
        title: item.label,
        key: item.value,
        className: classnames('min-width-140', parent.color),
        width: 140,
        render: (record) => (
          <div className={styles['list-avatar']}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                className={styles['item-avatar-signal']}
                key={item}
                role="presentation"
                onClick={() => this.setStateData({ visible: true })}
              >
                <AvatarTable
                  fileImage={Helper.getPathAvatarJson(
                    record?.studentMaster?.farther?.fileImage ||
                      record?.studentMaster?.mother?.fileImage,
                  )}
                  isActive={item === 4 || item === 2}
                />
              </div>
            ))}
          </div>
        ),
      })),
    }));
    const columns = [
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        width: 150,
        render: () => <Text size="normal">Preschool 1</Text>,
      },
      ...columnsMedical,
    ];
    return columns;
  };

  headerMedical = () => {
    const columns = [
      {
        title: 'SÁNG',
        key: 'class',
        render: () => <Text size="normal">Trước ăn sáng</Text>,
      },
      {
        key: 'parents',
        className: 'min-width-100',
        width: 100,
        render: () => '5 ml',
      },
    ];
    return columns;
  };

  handleCancel = () => this.setStateData({ visible: false });

  render() {
    const {
      data,
      error,
      classes,
      branches,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, visible } = this.state;
    const loading = effects['medicaFollow/GET_DATA'];
    return (
      <>
        <Helmet title="Theo dõi uống thuốc" />
        <Modal
          centered
          footer={false}
          onCancel={this.handleCancel}
          title={false}
          visible={visible}
          className={styles['modal-detail-container']}
        >
          <div
            className={classnames(
              styles['modal-header'],
              'd-flex justify-content-between align-items-center',
            )}
          >
            <AvatarTable fullName="Nguyễn Thị A" description="Preschool 1" />
            {HelperModules.tagStatus('PENDING')}
          </div>
          <div className={styles['modal-content']}>
            <h3 className={styles.title}>Thông tin chung</h3>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className={styles.label}>Triệu chứng</p>
                <p className={styles.norm}>Ho</p>
              </div>
              <div>
                <p className={styles.label}>Nơi đặt thuốc</p>
                <p className={styles.norm}>Trong balo</p>
              </div>
            </div>
            <hr />
            <h3 className={styles.title}>UỐNG THUỐC TRƯỚC ĂN SÁNG</h3>
            <div className={styles.list}>
              <div className={styles.item}>
                <div className={styles['image-container']}>
                  <img className={styles.thumb} src="/images/medical.png" alt="medical" />
                  <div className="pl10">
                    <p className={styles.label}>Tên thuốc</p>
                    <p className={styles.norm}>CEELIN</p>
                  </div>
                </div>
                <div>
                  <p className={styles.label}>Nội dung</p>
                  <p className={styles.norm}>5 ml</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classnames(
              styles['modal-footer'],
              'd-flex justify-content-center align-items-center',
            )}
          >
            <Button color="success" size="large" permission="YTE">
              Xác nhận đã cho uống
            </Button>
          </div>
        </Modal>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Theo dõi uống thuốc</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                classId: search.classId || null,
                date: search.creationTimeFrom &&
                  search.creationTimeTo && [
                    moment(search.creationTimeFrom),
                    moment(search.creationTimeTo),
                  ],
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="diseaseName"
                    onChange={(event) => this.onChange(event, 'diseaseName')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
                    name="branchId"
                    onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              className="table-color"
              error={error}
              isError={error.isError}
              bordered
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: '60vh' }}
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
  error: PropTypes.objectOf(PropTypes.any),
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
  error: {},
  classes: [],
};

export default Index;
