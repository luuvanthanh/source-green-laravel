import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import classnames from 'classnames';
import { isEmpty, debounce, get } from 'lodash';
import { Helmet } from 'react-helmet';
import { Modal, Radio } from 'antd';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import styles from '@/assets/styles/Common/common.scss';
import HelperModules from '../../utils/Helper';
import stylesModule from '../../styles.module.scss';

const { confirm } = Modal;
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
const mapStateToProps = ({ crmMarketingDataCheckList, loading }) => ({
  error: crmMarketingDataCheckList.error,
  pagination: crmMarketingDataCheckList.pagination,
  branches: crmMarketingDataCheckList.branches,
  city: crmMarketingDataCheckList.city,
  district: crmMarketingDataCheckList.district,
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
        key: query?.key,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      dataSource: [],
      dataCoincide: [],
      isModalVisible: false,
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
      dataCheck,
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'crmMarketingDataCheckList/GET_DATA',
      payload: {
        ...dataCheck,
      },
      callback: (response) => {
        if (response) {
          this.setStateData({
            dataSource: response.parsePayload,
          });
        }
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

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crmMarketingDataCheckList/GET_CITIES',
      payload: {},
    });
    dispatch({
      type: 'crmMarketingDataCheckList/GET_DISTRICTS',
      payload: {},
    });
  };

  /**
   * Function header table
   */
  header = () => {
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 70,
        fixed: 'left',
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Tên',
        key: 'name',
        width: 250,
        render: (record) => <>{record?.full_name}</>,
      },
      {
        title: 'Tình trạng',
        key: 'name',
        width: 150,
        render: (record) => HelperModules.tagStatus(record.status),
      },
      {
        title: 'Địa chỉ',
        key: 'address',
        width: 200,
        render: (record) => record?.address,
      },
      {
        title: 'Email',
        key: 'email',
        width: 200,
        render: (record) => record?.email,
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        width: 150,
        render: (record) => record?.phone,
      },
      {
        title: 'Tên con',
        key: 'nameChildren',
        width: 150,
        render: (record) => (
          <Text size="normal">{record?.studentInfo?.map((item) => item.full_name).join(', ')}</Text>
        ),
      },
      {
        title: 'Ngày sinh con',
        key: 'birth',
        width: 150,
        render: (record) => (
          <Text size="normal">
            {record?.studentInfo?.map((item) => item.birth_date).join(', ')}
          </Text>
        ),
      },
    ];
    return columns;
  };

  //

  headerModel = () => {
    const columns = [
      {
        title: 'Mã phụ huynh ',
        key: 'code',
        width: 170,
        fixed: 'left',
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeCoin(e, record, 'codeActive')}
              value={record.codeActive}
            >
              <Radio value={record.code}>{record.code}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Hình ảnh phụ huynh',
        key: 'img',
        width: 170,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeAvt(e, record, 'avtActive')}
              value={record.avtActive}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Radio value={record.file_image}>
                <AvatarTable fileImage={Helper.getPathAvatarJson(record.file_image)} />
              </Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Họ  và tên',
        key: 'name',
        width: 250,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeName(e, record, 'nameActive')}
              value={record.nameActive}
            >
              <Radio value={record.full_name}>{record.full_name} </Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Tình trạng',
        key: 'name',
        width: 150,
        render: (record) => HelperModules.tagStatus(record.status),
      },
      {
        title: 'Giới tính',
        key: 'sex',
        width: 150,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeSex(e, record, 'sexActive')}
              value={record.sexActive}
            >
              <Radio value={record.sex}>{variables.GENDERS[record?.sex] || ''}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Email',
        key: 'email',
        width: 250,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeEmail(e, record, 'emailActive')}
              value={record.emailActive}
            >
              <Radio value={record.email}>{record.email}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Số điện thoại',
        key: 'phone',
        width: 200,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangePhone(e, record, 'phoneActive')}
              value={record.phoneActive}
            >
              <Radio value={record.phone}>{record.phone}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Số điện thoại khác',
        key: 'other_phone',
        width: 200,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeOtherPhone(e, record, 'other_phoneActive')}
              value={record.other_phoneActive}
            >
              <Radio value={record.other_phone}>{record.other_phone}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Địa chỉ',
        key: 'address',
        width: 200,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeAddress(e, record, 'addressActive')}
              value={record.addressActive}
            >
              <Radio value={record.address}>{record.address}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Xã phường',
        key: 'townWard',
        width: 200,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeTownWard(e, record, 'townWardActive')}
              value={record.townWardActive}
            >
              <Radio value={record.town_ward_id}>{get(record, 'townWard.name')}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Quận Huyện',
        key: 'district',
        width: 170,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeDistrict(e, record, 'districtActive')}
              value={record.districtActive}
            >
              <Radio value={record.district_id}>{get(record, 'district.name')}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Tỉnh thành',
        key: 'city',
        width: 170,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeCity(e, record, 'cityActive')}
              value={record.cityActive}
            >
              <Radio value={record.city_id}>{get(record, 'city.name')}</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Tên con',
        key: 'full_name',
        width: 170,
        render: (record) => (
          <>
            <Radio.Group
              value={record.studentsNameActive}
            >
              <Radio value={record.studentInfo} onChange={(e) => this.onChangeStudentsName(e, record, 'studentsNameActive')}>
                {record?.studentInfo?.map((item, index) => (
                  <Text size="normal" key={index}>
                    {item.full_name}
                  </Text>
                ))}
              </Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'Ngày sinh con',
        key: 'student_birth_date',
        width: 170,
        render: (record) => (
          <>
            <Radio.Group
              onChange={(e) => this.onChangeStudentsBirthDay(e, record, 'StudentsBirthDayActive')}
              value={record.StudentsBirthDayActive}
            >
              <Radio value={record.studentInfo}>
                {record?.studentInfo?.map((item, index) => (
                  <Text size="normal" key={index}>
                    {item.birth_date}
                  </Text>
                ))}
              </Radio>
            </Radio.Group>
          </>
        ),
      },
    ];
    return columns;
  };

  confirmAction = ({ callback }) => {
    confirm({
      centered: true,
      okText: 'Đồng ý',
      cancelText: 'Đóng',
      wrapClassName: 'wrapper-modal',
      content: (
        <>
          <div className={stylesModule['wrapper-modal-coincide']}> <img src="/images/group.png" alt="bmi" /> </div>
          <div className={stylesModule['wrapper-coincide-title']}>Dữ liệu bản ghi phụ huynh được chọn sẽ được giữ lại. Dữ liệu bản ghi khác sẽ bị xóa, nhưng những dữ liệu liên quan sẽ được giao cho bản ghi phụ huynh đã chọn.</div>
          <div className={stylesModule['wrapper-coincide-description']}>Bạn có chắc muốn gộp dữ liệu các bản ghi này?</div>
        </>
      ),
      onOk() {
        callback();
      },
      onCancel() { },
    });
  };


  submit = () => {
    const { dataCoincide } = this.state;
    const items = dataCoincide.filter((item) => item !== null);
    const student = items.filter((item) => item.studentsNameActive);
    const a = student.map((item) => item.studentsNameActive);
    const { search } = this.state;
    const {
      location: { query },
      location: { pathname },
    } = this.props;
    if (items.length && a.length) {
      this.confirmAction({
        callback: () => {
          this.props.dispatch({
            type: 'crmMarketingDataCheckList/ADD_COINCIDE',
            payload: {
              merge_data_marketing_id: items.map((item) => item.id),
              sex: items.map((item) => item.sexActive).join(''),
              code: items.map((item) => item.codeActive).join(''),
              file_image: items.map((item) => item.avtActive).join(''),
              full_name: items.map((item) => item.nameActive).join(''),
              email: items.map((item) => item.emailActive).join(''),
              phone: items.map((item) => item.phoneActive).join(''),
              other_phone: items.map((item) => item.other_phoneActive).join(''),
              address: items.map((item) => item.addressActive).join(''),
              town_ward_id: items?.map((item) => item.townWardActive).join(''),
              district_id: items?.map((item) => item.districtActive).join(''),
              city_id: items?.map((item) => item.cityActive).join(''),
              studen_info: a[0].map((i) => ({ full_name: i.full_name, birth_date: i.birth_date })),
            },
            callback: (response, error) => {
              if (response) {
                this.setStateData({ isModalVisible: false });
                this.props.dispatch({
                  type: 'crmMarketingData/GET_DATA',
                  payload: {
                    page: query?.page,
                    limit: query?.limit,
                  },
                });
                this.onLoad();
              }
              if (error) {
                if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
                  error.data.errors.forEach((item) => {
                    this.formRef.current.setFields([
                      {
                        name: get(item, 'source.pointer'),
                        errors: [get(item, 'detail')],
                      },
                    ]);
                  });
                }
              }
            },
          });
        },
      });
    } else {
      this.confirmAction({
        callback: () => {
          this.props.dispatch({
            type: 'crmMarketingDataCheckList/ADD_COINCIDE',
            payload: {
              merge_data_marketing_id: items.map((item) => item.id),
              sex: items.map((item) => item.sexActive).join(''),
              code: items.map((item) => item.codeActive).join(''),
              file_image: items.map((item) => item.avtActive).join(''),
              full_name: items.map((item) => item.nameActive).join(''),
              email: items.map((item) => item.emailActive).join(''),
              phone: items.map((item) => item.phoneActive).join(''),
              other_phone: items.map((item) => item.other_phoneActive).join(''),
              address: items.map((item) => item.addressActive).join(''),
              town_ward_id: items?.map((item) => item.townWardActive).join(''),
              district_id: items?.map((item) => item.districtActive).join(''),
              city_id: items?.map((item) => item.cityActive).join(''),
            },
            callback: (response, error) => {
              if (response) {
                this.isModal();
                this.props.dispatch({
                  type: 'crmMarketingData/GET_DATA',
                  payload: {
                    page: query?.page,
                    limit: query?.limit,
                  },
                });
              }
              if (error) {
                if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
                  error.data.errors.forEach((item) => {
                    this.formRef.current.setFields([
                      {
                        name: get(item, 'source.pointer'),
                        errors: [get(item, 'detail')],
                      },
                    ]);
                  });
                }
              }
            },
          });
          history.push({
            pathname,
            query: Helper.convertParamSearch(search),
          });
        },
      });
    }
  };

  showModal = () => {
    const { dataSource } = this.state;
    this.setStateData({ isModalVisible: true });
    const items = dataSource.filter((item) => item.isActive);
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    if (items.length) {
      this.props.dispatch({
        type: 'crmMarketingDataCheckList/GET_DATA_COINCIDE',
        payload: {
          data_marketing_id: items.map((item) => item.id).join(','),
        },
        callback: (response) => {
          if (response) {
            this.setStateData({
              dataCoincide: response,
            });
          }
        },
      });
      history.push({
        pathname,
        query: Helper.convertParamSearch(search),
      });
    }
  };

  onChangeCoin = (e, record = {}, key = ['codeActive'], keyOrigin = 'code') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
        nameActive: record.id === item.id ? record.full_name : undefined,
        avtActive: record.id === item.id ? record.file_image : undefined,
        sexActive: record.id === item.id ? record.sex : undefined,
        emailActive: record.id === item.id ? record.email : undefined,
        phoneActive: record.id === item.id ? record.phone : undefined,
        other_phoneActive: record.id === item.id ? record.other_phone : undefined,
        addressActive: record.id === item.id ? record.address : undefined,
        townWardActive: record.id === item.id ? record.town_ward_id : undefined,
        districtActive: record.id === item.id ? record.district_id : undefined,
        cityActive: record.id === item.id ? record.city_id : undefined,
        studentsNameActive: record.id === item.id ? record.studentInfo : undefined,
        StudentsBirthDayActive: record.id === item.id ? record.studentInfo : undefined,
      })),
    }));
  };

  onChangeName = (e, record = {}, key = 'nameActive', keyOrigin = 'full_name') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeAvt = (e, record = {}, key = 'avtActive', keyOrigin = 'file_image') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeEmail = (e, record = {}, key = 'emailActive', keyOrigin = 'email') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeSex = (e, record = {}, key = 'sexActive', keyOrigin = 'sex') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangePhone = (e, record = {}, key = 'phoneActive', keyOrigin = 'phone') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeOtherPhone = (e, record = {}, key = 'other_phoneActive', keyOrigin = 'other_phone') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeAddress = (e, record = {}, key = 'addressActive', keyOrigin = 'address') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeTownWard = (e, record = {}, key = 'townWardActive', keyOrigin = 'town_ward_id') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeDistrict = (e, record = {}, key = 'districtActive', keyOrigin = 'district_id') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeCity = (e, record = {}, key = 'cityActive', keyOrigin = 'city_id') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeStudentsName = (e, record = {}, key = 'studentsNameActive', keyOrigin = 'studentInfo') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  onChangeStudentsBirthDay = (e, record = {}, key = 'StudentsBirthDayActive', keyOrigin = 'studentInfo') => {
    this.setState((prevState) => ({
      dataCoincide: prevState.dataCoincide.map((item) => ({
        ...item,
        [key]: record.id === item.id ? record[keyOrigin] : undefined,
      })),
    }));
  };

  handleOk = () => {
    this.setState({ isModalVisible: false });
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  onSelectChange = (e) => {
    this.setStateData((prevState) => ({
      dataSource: prevState.dataSource.map((item) => ({
        ...item,
        isActive: !!e.includes(item.id),
      })),
    }));
  };

  isModal = () => {
    this.props.parentCallback({ isModal: false });
  };

  // isMergeAll = () => {
  //   const {  dataSource } = this.state;
  //   const {
  //     location: { query },
  //   } = this.props;

  //   this.props.dispatch({
  //     type: 'crmMarketingDataCheckList/MERGE_ALL',
  //     payload: {
  //       id: dataSource?.map(i=> i?.id),
  //     },
  //     callback: (response) => {
  //       if (response) {
  //         this.props.dispatch({
  //           type: 'crmMarketingData/GET_DATA',
  //           payload: {
  //             page: query?.page,
  //             limit: query?.limit,
  //           },
  //         });
  //         this.onLoad();
  //       }
  //     },
  //   });
  // };

  render() {
    const {
      match: { params },
      loading: { effects },
    } = this.props;
    const { dataSource, isModalVisible, dataCoincide } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
    };

    const loading =
      effects['crmMarketingDataCheckList/GET_DATA'] || effects['crmMarketingDataCheckList/GET_DATA_COINCIDE'];
    const submitCoincide = effects['crmMarketingDataCheckList/ADD_COINCIDE'];
    return (
      <>
        <Helmet title="Data Marketing trùng" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Data Marketing trùng</Text>
          </div>
          <div className={styles['block-table']}>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={dataSource}
              loading={loading}
              rowSelection={{ ...rowSelection }}
              pagination={false}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
            />
            <div className="d-flex  justify-content-center mt-5">
              <Button color="yellow" icon="comeback"  onClick={this.isModal}>
                Quay lại
              </Button>
              <div>
                <Button color="success" icon="shrink" className="ml-5 mr-5" onClick={this.showModal}  >
                  Gộp dữ liệu
                </Button>
                <Modal
                  title="Chọn gộp dữ liệu"
                  className={stylesModule['wrapper-modal-selection']}
                  centered
                  visible={isModalVisible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  width={['80%']}
                  footer={[
                    <Button
                      color="yellow"
                      icon="comeback"
                      onClick={this.handleCancel}
                      className="m15"
                    >
                      Quay lại
                    </Button>,
                    <Button
                      color="success"
                      icon="shrink"
                      className="m15"
                      onClick={this.submit}
                      loading={submitCoincide}
                    >
                      Gộp dữ liệu
                    </Button>,
                  ]}
                >
                  <div>
                    <Table
                      bordered
                      columns={this.headerModel(params)}
                      dataSource={dataCoincide}
                      className="table-edit"
                      pagination={false}
                      loading={loading}
                      params={{
                        header: this.headerModel(),
                        type: 'table',
                      }}
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
                    />
                  </div>
                </Modal>
              </div>
              {/* <Button color="danger" icon="shrink"  loading={effects['crmMarketingDataCheckList/MERGE_ALL']}  onClick={this.isMergeAll}>
                Gộp tất cả
              </Button> */}
            </div>
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
  dataCheck: PropTypes.objectOf(PropTypes.any),
  parentCallback: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  location: {},
  dataCheck: {},
  parentCallback: {},
};

export default Index;
