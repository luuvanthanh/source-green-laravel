import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Checkbox, Input } from 'antd';
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
import variablesModules from '../utils/variables';

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
const mapStateToProps = ({ medicalLogBook, loading }) => ({
  data: medicalLogBook.data,
  branches: medicalLogBook.branches,
  classes: medicalLogBook.classes,
  pagination: medicalLogBook.pagination,
  error: medicalLogBook.error,
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
        branchId: query?.branchId,
        timeCode: query?.timeCode,
        appliedDate: query?.appliedDate ? moment(query.appliedDate) : moment(),
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      dataSource: [],
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
      type: 'medicalLogBook/GET_DATA',
      payload: {
        ...search,
      },
      callback: (response) => {
        this.setStateData({
          dataSource: response.map((item, index) => ({
            ...item,
            level: 1,
            children: item.drinkingTimes.map((itemDrink) => ({
              ...itemDrink,
              level: 2,
              children: itemDrink.medicineTimes.map((itemMedicine) => ({
                ...itemMedicine,
                level: 3,
                parentId: index,
              })),
            })),
          })),
        });
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        appliedDate: Helper.getDate(search.appliedDate, variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  };

  /**
   * Function load branches
   */
  loadCategories = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'medicalLogBook/GET_CLASSES',
        payload: search,
      });
    }
    dispatch({
      type: 'medicalLogBook/GET_BRACHES',
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
      type: 'medicalLogBook/GET_CLASSES',
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
    this.debouncedSearch(Helper.getDate(e, variables.DATE_FORMAT.DATE_AFTER), type);
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

  onChangeReceived = (event, record) => {
    this.setStateData((prevState) => ({
      dataSource: prevState.dataSource.map((item, index) => {
        if (index === record.parentId) {
          return {
            ...item,
            children: item.children.map((itemChildren) => {
              if (itemChildren.timeCode === record.timeCode) {
                return {
                  ...itemChildren,
                  children: itemChildren.children.map((itemMedicine) => {
                    if (itemMedicine.id === record.id) {
                      return {
                        ...itemMedicine,
                        isReceived: event.target.checked,
                      };
                    }
                    return itemMedicine;
                  }),
                };
              }
              return itemChildren;
            }),
          };
        }
        return item;
      }),
    }));
  };

  onChangeDrunk = (event, record) => {
    this.setStateData((prevState) => ({
      dataSource: prevState.dataSource.map((item, index) => {
        if (index === record.parentId) {
          return {
            ...item,
            children: item.children.map((itemChildren) => {
              if (itemChildren.timeCode === record.timeCode) {
                return {
                  ...itemChildren,
                  children: itemChildren.children.map((itemMedicine) => {
                    if (itemMedicine.id === record.id) {
                      return {
                        ...itemMedicine,
                        isDrunk: event.target.checked,
                      };
                    }
                    return itemMedicine;
                  }),
                };
              }
              return itemChildren;
            }),
          };
        }
        return item;
      }),
    }));
  };

  onChangeNote = (event, record) => {
    this.setStateData((prevState) => ({
      dataSource: prevState.dataSource.map((item, index) => {
        if (index === record.parentId) {
          return {
            ...item,
            children: item.children.map((itemChildren) => {
              if (itemChildren.timeCode === record.timeCode) {
                return {
                  ...itemChildren,
                  children: itemChildren.children.map((itemMedicine) => {
                    if (itemMedicine.id === record.id) {
                      return {
                        ...itemMedicine,
                        note: event.target.value,
                      };
                    }
                    return itemMedicine;
                  }),
                };
              }
              return itemChildren;
            }),
          };
        }
        return item;
      }),
    }));
  };

  /**
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'Trẻ',
        key: 'student',
        className: 'min-width-200',
        width: 200,
        fixed: 'left',
        render: (record) =>
          record.drinkingTimes && (
            <AvatarTable
              fileImage={Helper.getPathAvatarJson(
                record?.medical?.studentMaster?.student?.fileImage,
              )}
              fullName={record?.medical?.studentMaster?.student?.fullName}
            />
          ),
      },
      {
        title: 'Tên bệnh',
        key: 'title',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">{record.drinkingTimes && record?.medical?.diseaseName}</Text>
        ),
      },
      {
        title: 'Vị trí đặt thuốc',
        key: 'title',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">{record.drinkingTimes && record?.medical?.medicineLocation}</Text>
        ),
      },
      {
        title: 'Thời gian uống',
        key: 'title',
        className: 'min-width-150',
        render: (record) => (
          <Text size="normal">
            {record.level === 2 && variablesModules.STATUS_TIME_CODE_NAME[record.timeCode]}
          </Text>
        ),
      },
      {
        title: 'Thuốc',
        key: 'name',
        className: 'min-width-200',
        width: 200,
        render: (record) =>
          !record.children && (
            <AvatarTable
              fileImage={Helper.getPathAvatarJson(record?.medicine?.files)}
              fullName={record?.medicine?.name}
            />
          ),
      },
      {
        title: 'Đơn vị',
        key: 'unit',
        className: 'min-width-100',
        width: 100,
        align: 'center',
        render: (record) => <Text size="normal">{!record.children && record?.medicine?.unit}</Text>,
      },
      {
        title: 'Liều lượng',
        key: 'medicineAmount',
        className: 'min-width-100',
        width: 100,
        align: 'center',
        render: (record) => <Text size="normal">{record?.medicineAmount}</Text>,
      },
      {
        title: 'Đã nhận',
        key: 'isReceived',
        className: 'min-width-100',
        width: 100,
        align: 'center',
        render: (record) =>
          !record.children && (
            <Checkbox
              checked={record.isReceived}
              onChange={(event) => this.onChangeReceived(event, record)}
            />
          ),
      },
      {
        title: 'Đã cho uống',
        key: 'isDrunk',
        className: 'min-width-100',
        width: 100,
        align: 'center',
        render: (record) =>
          !record.children && (
            <Checkbox
              checked={record.isDrunk}
              onChange={(event) => this.onChangeDrunk(event, record)}
            />
          ),
      },
      {
        title: 'Ghi chú',
        key: 'note',
        className: 'min-width-200',
        width: 200,
        render: (record) =>
          !record.children && (
            <Input value={record.note} onChange={(event) => this.onChangeNote(event, record)} />
          ),
      },
    ];
    return columns;
  };

  onSave = () => {
    const { dataSource } = this.state;
    let data = [];
    dataSource.forEach((item) => {
      item.children.forEach((itemChildren) => {
        itemChildren.children.forEach((itemMedicine) => {
          data = [
            ...data,
            {
              medicalId: item?.medical?.id,
              medicineTimeId: itemMedicine.id,
              isReceived: itemMedicine.isReceived,
              isDrunk: itemMedicine.isDrunk,
              note: itemMedicine.note,
            },
          ];
        });
      });
    });
    this.props.dispatch({
      type: 'medicalLogBook/UPDATE',
      payload: data,
      callback: (response) => {
        if (response) {
          this.onLoad();
        }
      },
    });
  };

  render() {
    const {
      error,
      classes,
      branches,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, dataSource } = this.state;
    const loading = effects['medicalLogBook/GET_DATA'];
    const loadingSubmit = effects['medicalLogBook/UPDATE'];
    return (
      <>
        <Helmet title="Danh sách đơn thuốc" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh sách đơn thuốc</Text>
            <Button color="success" onClick={this.onSave} loading={loadingSubmit}>
              Lưu cập nhật
            </Button>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                classId: search.classId || null,
                timeCode: search.classId || null,
                appliedDate: search.appliedDate && moment(search.appliedDate),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="appliedDate"
                    onChange={(event) => this.onChangeDate(event, 'appliedDate')}
                    type={variables.DATE_PICKER}
                    allowClear={false}
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
                    data={[
                      { id: null, name: 'Tất cả thời gian' },
                      ...variablesModules.STATUS_TIME_CODE.map((item) => ({
                        id: item.value,
                        name: item.label,
                      })),
                    ]}
                    name="timeCode"
                    onChange={(event) => this.onChangeSelect(event, 'timeCode')}
                    type={variables.SELECT}
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={dataSource}
              loading={loading}
              error={error}
              isError={error.isError}
              pagination={false}
              defaultExpandAllRows
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record?.medical?.id || record?.timeCode || record?.id}
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
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  location: {},
  branches: [],
  error: {},
  classes: [],
};

export default Index;
