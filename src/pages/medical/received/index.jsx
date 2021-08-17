import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Modal, Collapse, Image } from 'antd';
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
const mapStateToProps = ({ medicaReceived, loading }) => ({
  data: medicaReceived.data,
  branches: medicaReceived.branches,
  classes: medicaReceived.classes,
  pagination: medicaReceived.pagination,
  error: medicaReceived.error,
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
      type: 'medicaReceived/GET_DATA',
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
        type: 'medicaReceived/GET_CLASSES',
        payload: search,
      });
    }
    dispatch({
      type: 'medicaReceived/GET_BRACHES',
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
      type: 'medicaReceived/GET_CLASSES',
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
    const columns = [
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.medicineLocation}</Text>,
      },
      {
        title: 'Học sinh',
        key: 'parents',
        render: (record) => (
          <div className={styles['list-avatar']}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                className={styles['item-avatar']}
                key={item}
                role="presentation"
                onClick={() => this.setStateData({ visible: true })}
              >
                <AvatarTable
                  fileImage={Helper.getPathAvatarJson(
                    record?.studentMaster?.farther?.fileImage ||
                      record?.studentMaster?.mother?.fileImage,
                  )}
                  fullName="Nguyễn Thị A"
                  isActive={item === 4 || item === 2}
                />
              </div>
            ))}
          </div>
        ),
      },
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
    const loading = effects['medicaReceived/GET_DATA'];
    return (
      <>
        <Helmet title="Danh sách nhận thuốc" />
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
            <h3 className={styles.title}>Thông tin thuốc</h3>
            <Collapse
              defaultActiveKey={['1']}
              className={styles['collapse-container']}
              expandIconPosition="right"
            >
              <Collapse.Panel
                header={<div className={styles['container-header']}>CEELIN</div>}
                key="1"
              >
                <p className={styles.label}>Tên thuốc</p>
                <p className={styles.norm}>PROSPAN</p>
                <hr />
                <p className={styles.label}>Thời gian uống</p>
                <Table
                  columns={this.headerMedical(params)}
                  dataSource={[{ id: 1 }]}
                  error={error}
                  pagination={false}
                  params={{
                    header: this.headerMedical(),
                    type: 'table',
                  }}
                  rowKey={(record) => record.id}
                  scroll={{ x: '100%' }}
                />
                <div className={styles.timeline}>
                  <span className="icon-checkmark" />
                  <strong>Lặp lại: 08/08 - 10/08</strong>
                </div>
                <hr />
                <div>
                  <label className={styles.label}>Hình ảnh:</label>
                  <div className="d-flex">
                    <Image.PreviewGroup>
                      {[1, 2, 3].map((item, index) => (
                        <div key={index} className={styles['group-image']}>
                          <Image
                            key={index}
                            width={85}
                            src={`${API_UPLOAD}${item}`}
                            fallback="/default-upload.png"
                          />
                        </div>
                      ))}
                    </Image.PreviewGroup>
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>
          </div>
          <div
            className={classnames(
              styles['modal-footer'],
              'd-flex justify-content-center align-items-center',
            )}
          >
            <Button color="success" size="large" permission="YTE">
              Xác nhận đã nhận thuốc
            </Button>
          </div>
        </Modal>
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách nhận thuốc</Text>
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
              error={error}
              isError={error.isError}
              bordered
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
