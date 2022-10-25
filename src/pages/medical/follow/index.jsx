import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Modal, Image } from 'antd';
import classnames from 'classnames';
import { debounce, isArray, head } from 'lodash';
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
const mapStateToProps = ({ medicaFollow, loading, user }) => ({
  loading,
  data: medicaFollow.data,
  branches: medicaFollow.branches,
  classes: medicaFollow.classes,
  pagination: medicaFollow.pagination,
  configs: medicaFollow.configs,
  error: medicaFollow.error,
  defaultBranch: user.defaultBranch,
  user: user.user,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      defaultBranch,
      location: { query },
      user
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        diseaseName: query?.diseaseName,
        branchId: query?.branchId || defaultBranch?.id,
        classId: query?.classId || user?.role === "Teacher" && head(user?.objectInfo?.classTeachers)?.classId,
        status: query?.status || variablesModules.STATUS.PENDING,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
        date: query.date ? moment(query.date) : moment(),
        isSent: true,
        isReceived: true,
      },
      visible: false,
      objects: {},
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
          date: Helper.getDate(search.date, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  /**
   * Function load branches
   */
  loadCategories = () => {
    const { dispatch, defaultBranch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'medicaFollow/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (!defaultBranch?.id) {
      dispatch({
        type: 'medicaFollow/GET_BRACHES',
        payload: {},
      });
    }

    dispatch({
      type: 'medicaFollow/GET_CONFIGS',
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
  debouncedSearchDateRank = debounce((from, to) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          from,
          to,
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

  onchangeDetail = (value, id, classId, medicineTimeType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'medicaFollow/GET_DETAIL',
      payload: {
        value, id
      },
      callback: (response) => {
        if (response) {
          this.setStateData({ visible: true, objects: { ...response, class: classId, medicineTimeTypeId: medicineTimeType }, });
        }
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const { configs } = this.props;
    const columnsMedical = configs.map((parent, index) => ({
      title: parent?.group?.name || parent?.group?.description,
      key: parent?.group?.name || parent?.group?.description,
      className: classnames(
        { yellow: index === 0 },
        { gold: index === 1 },
        { primary: index === 2 },
        'parent',
      ),
      children: parent?.items?.map((item) => ({
        title: item.description,
        key: item.name,
        className: classnames(
          'min-width-140',
          { yellow: index === 0 },
          { gold: index === 1 },
          { primary: index === 2 },
        ),
        width: 140,
        render: (record) => {
          const group = record?.items?.find((item) => item?.group?.id === parent?.group?.id);
          const children = group?.items?.find((itemGroup) => itemGroup.name === item.name);
          return (
            <div className={styles['list-avatar']}>
              {children?.items?.map((itemChild, index) => {
                const status = head(itemChild.status);
                return (
                  <div
                    className={styles['item-avatar-signal']}
                    key={index}
                    role="presentation"
                    // onClick={() =>
                    //   this.setStateData({
                    //     visible: true,
                    //     objects: { ...itemChild, class: record.class, medicineTimeTypeId: item.id },
                    //   })
                    // }
                    onClick={() => this.onchangeDetail(itemChild?.id, item?.id, record.class, item.id)}
                  >
                    <AvatarTable
                      isBorder={status?.status === 'NOT_DRINK'}
                      isActive={status?.status === 'DRINK'}
                      fileImage={Helper.getPathAvatarJson(itemChild?.student?.fileImage)}
                    />
                  </div>
                );
              })}
            </div>
          );
        },
      })),
    }));
    const columns = [
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.class?.name}</Text>,
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

  handleCancel = () => this.setStateData({ visible: false, objects: {} });

  onReceived = () => {
    const { objects } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'medicaFollow/RECEIVED',
      payload: {
        id: objects.id,
        medicineTimeTypeId: objects.medicineTimeTypeId,
        date: moment(),
      },
      callback: (response) => {
        if (response) {
          this.handleCancel();
          this.onLoad();
        }
      },
    });
  };

  render() {
    const {
      data,
      error,
      classes,
      branches,
      pagination,
      defaultBranch,
      match: { params },
      loading: { effects },
      user
    } = this.props;
    const { search, visible, objects, defaultBranchs } = this.state;
    const loading = effects['medicaFollow/GET_DATA'];
    const loadingSubmit = effects['medicaFollow/RECEIVED'];
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
            <AvatarTable
              fullName={objects?.student?.fullName}
              fileImage={Helper.getPathAvatarJson(objects?.student?.fileImage)}
              description={objects?.class?.name}
            />
            {head(objects?.status)?.status === 'DRINK' && HelperModules.tagStatusDrink('DRINK')}
            {head(objects?.status)?.status === 'NOT_DRINK' &&
              HelperModules.tagStatusDrink('NOT_DRINK')}
          </div>
          <div className={styles['modal-content']}>
            <h3 className={styles.title}>Thông tin chung</h3>
            <div className="d-flex justify-content-between row">
              <div className='col-lg-6'>
                <p className={styles.label}>Triệu chứng</p>
                <p className={styles.norm}>{objects?.diseaseName}</p>
              </div>
              <div className="text-right col-lg-6">
                <p className={styles.label}>Nơi đặt thuốc</p>
                <p className={styles.norm}>{objects?.medicineLocation}</p>
              </div>
            </div>
            <hr />
            {objects?.medicines?.map(({ id, files, name, medicineTimes }) => (
              <div key={id}>
                <h3 className={styles.title} >
                  UỐNG THUỐC {head(medicineTimes)?.medicineTimeType?.description?.toUpperCase()}
                </h3>
                <div className={classnames(
                  styles.list
                )}>
                  <div className={classnames(styles.item,
                    'row',
                  )}>
                    <div className={classnames(styles['image-container'],
                      'col-lg-6',
                    )}>
                      {Helper.isJSON(files) && (
                        <div>
                          <Image.PreviewGroup>
                            {isArray(JSON.parse(files)) &&
                              JSON.parse(files)?.map((item, index) => (
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
                      )}
                      <div className="pl10">
                        <p className={styles.label}>Tên thuốc</p>
                        <p className={styles.norm}>{name}</p>
                      </div>
                    </div>
                    <div className="text-right col-lg-6">
                      <p className={styles.label}>Nội dung</p>
                      <p className={styles.norm}>{head(medicineTimes)?.note}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {head(objects?.status)?.status === 'NOT_DRINK' &&
            Helper.getDate(head(objects?.status)?.date, variables.DATE_FORMAT.DATE_AFTER) ===
            Helper.getDate(moment(), variables.DATE_FORMAT.DATE_AFTER) && (
              <div
                className={classnames(
                  styles['modal-footer'],
                  'd-flex justify-content-center align-items-center',
                )}
              >
                <Button
                  color="success"
                  size="large"
                  permission="YTE"
                  onClick={this.onReceived}
                  loading={loadingSubmit}
                >
                  Xác nhận đã cho uống
                </Button>
              </div>
            )}
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
                date: search.date && moment(search.date),
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
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
                      name="branchId"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                    />
                  </div>
                )}
                {defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={defaultBranchs}
                      name="branchId"
                      allowClear={false}
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <FormItem
                    data={user?.role === "Teacher" ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả lớp', id: null }, ...classes]}
                    name="classId"
                    allowClear={false}
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDate(event, 'date')}
                    type={variables.DATE_PICKER}
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
              childrenColumnName="noColumn"
              bordered
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id || record?.class?.id}
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
  configs: PropTypes.arrayOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
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
  configs: [],
  defaultBranch: {},
  user: {},
};

export default Index;
