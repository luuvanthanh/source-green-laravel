import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Avatar, Modal, Input } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Select from '@/components/CommonComponent/Select';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Table from '@/components/CommonComponent/Table';
import Children from './components/children';
import Maps from './components/maps';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import variablesModules from '../../utils/variables';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { head, isEmpty, omit } from 'lodash';
import moment from 'moment';

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
const mapStateToProps = ({ menu, tutorialAdd, loading }) => ({
  loading,
  details: tutorialAdd.details,
  menuData: menu.menuLeftVehicel,
  branches: tutorialAdd.branches,
  students: tutorialAdd.students,
  employees: tutorialAdd.employees,
  busInformations: tutorialAdd.busInformations,
});
const { confirm } = Modal;
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      busPlaces: [
        {
          id: '1',
          studentBusPlaces: [],
        },
      ],
      listId: null,
      visible: false,
      visibleMap: false,
      studentBusPlaces: [],
      bus: [],
      busId: null,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.loadDetails();
    this.loadCategories();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && params.id) {
      this.formRef.current.setFieldsValue({
        name: details.name,
        startedPlace: details.startedPlace,
        startDate: details.startDate && moment(details.startDate),
        endDate: details.endDate && moment(details.endDate),
        busRouteNannies: details.busRouteNannies.map((item) => item.nannyId),
        busRouteShedules: details.busRouteShedules.map((item) => item.dayOfWeek),
      });
      this.onSetBus(details);
      this.onSetBusPlaces(details);
    }
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

  loadDetails = () => {
    const {
      match: { params },
      dispatch,
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'tutorialAdd/GET_DATA',
        payload: params,
      });
    }
  };

  loadCategories = () => {
    this.props.dispatch({
      type: 'tutorialAdd/GET_BRANCHES',
      payload: {},
    });
    this.props.dispatch({
      type: 'tutorialAdd/GET_BUS_INFORMATIONS',
      payload: {},
    });
    this.props.dispatch({
      type: 'tutorialAdd/GET_EMPLOYEES',
      payload: {},
    });
    this.props.dispatch({
      type: 'tutorialAdd/GET_STUDENTS',
      payload: {
        classStatus: 'HAS_CLASS',
      },
    });
  };

  onSetBusPlaces = (record) => {
    this.setStateData({
      busPlaces: record.busPlaces.map((item) => ({
        ...item,
        studentBusPlaces: item.studentBusPlaces.map((itemStudent) => ({
          ...itemStudent,
          ...itemStudent.student,
        })),
      })),
    });
  };

  onSetBus = (record) => {
    this.setStateData({
      bus: [record.busInfor],
      busId: record.busId,
    });
  };

  onChangeBus = (value) => {
    const { busInformations } = this.props;
    this.setStateData({
      bus: busInformations.filter((item) => item.id === value),
      busId: value,
    });
  };

  /**
   * Function save table cancel
   * @param {array} cancelPolicies values of table cancel
   */
  onSave = (items, listId) => {
    this.setStateData((prevState) => ({
      busPlaces: prevState.busPlaces.map((item) => {
        if (item.id === listId) {
          return {
            ...item,
            studentBusPlaces: items,
            parentId: listId,
          };
        }
        return item;
      }),
      visible: false,
    }));
  };

  /**
   * Function save table cancel
   * @param {object} record values of item table
   */
  collapsed = (record) => {
    this.setStateData((prevState) => ({
      busPlaces: prevState.busPlaces.map((item) => {
        if (item.id === record.id) {
          return {
            ...item,
            collapsed: !item.collapsed,
          };
        }
        return item;
      }),
    }));
  };

  /**
   * Function edit list
   * @param {uid} id id of items
   */
  onEditList = (record) => {
    this.setStateData({
      visible: true,
      listId: record.id,
      studentBusPlaces: record.studentBusPlaces.map((item) => item.id),
    });
  };

  handleCancel = () => {
    this.setStateData({
      visible: false,
      listId: null,
      studentBusPlaces: [],
    });
  };

  /**
   * Function save table cancel
   */
  addList = () => {
    this.setStateData((prevState) => ({
      busPlaces: [...prevState.busPlaces, { id: Math.random().toString(36).substr(2, 9) }],
    }));
  };

  showMap = (record) => {
    this.setStateData({
      visibleMap: true,
      listId: record.id,
    });
  };

  handleCancelMap = () => {
    this.setStateData({
      visibleMap: false,
    });
  };

  onRemove = (id) => {
    const self = this;
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        self.setStateData((prevState) => ({
          busPlaces: prevState.busPlaces.filter((item) => item.id !== id),
        }));
      },
      onCancel() {},
    });
  };

  onRemoveChildren = (record) => {
    this.setStateData((prevState) => ({
      busPlaces: prevState.busPlaces.map((item) => {
        if (item.id == record.parentId) {
          return {
            ...item,
            busPlaces: item.busPlaces.filter((itemChildren) => itemChildren.key !== record.key),
          };
        }
        return item;
      }),
    }));
  };

  /**
   * Function header table
   */
  header = (type) => {
    let columns = [];
    if (type === 'CHILDREN') {
      columns = [
        {
          title: 'STT',
          key: 'index',
          className: 'min-width-60',
          width: 60,
          align: 'center',
          render: (text, record, index) => <Text size="normal">{index + 1}</Text>,
        },
        {
          title: 'HỌC SINH',
          key: 'name',
          className: 'min-width-200',
          render: (record) => {
            return (
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(record.fileImage)}
                fullName={record.fullName}
              />
            );
          },
        },
        {
          title: 'ĐỊA CHỈ',
          key: 'address',
          className: 'min-width-150',
          render: (record) => <Text size="normal">{record.address}</Text>,
        },
        {
          key: 'action',
          className: 'min-width-80',
          width: 80,
          render: (record) => (
            <div className={styles['list-button']}>
              <Button color="danger" icon="remove" onClick={() => this.onRemoveChildren(record)} />
            </div>
          ),
        },
      ];
    } else {
      columns = [
        {
          title: 'MÃ SỐ',
          key: 'code',
          className: 'min-width-150',
          render: (record) => <Text size="normal">{record.code}</Text>,
        },
        {
          title: 'HÃNG',
          key: 'manufacturer',
          className: 'min-width-150',
          render: (record) => <Text size="normal">{record.manufacturer}</Text>,
        },
        {
          title: 'SỐ CHỔ NGỒI',
          key: 'seats',
          className: 'min-width-150',
          render: (record) => <Text size="normal">{record.seats} chỗ</Text>,
        },
        {
          title: 'XE',
          key: 'vehicle',
          className: 'min-width-200',
          render: (record) => (
            <Text size="normal">
              <Avatar
                size={32}
                shape="circle"
                className="mr-2"
                src={record.fileImage && `${API_UPLOAD}${record.fileImage}`}
              />
              {record.name}
            </Text>
          ),
        },
        {
          title: 'ĐỜI',
          key: 'life',
          className: 'min-width-150',
          render: (record) => <Text size="normal"> {record.year}</Text>,
        },
        {
          title: 'TRUYỀN ĐỘNG',
          key: 'movement',
          className: 'min-width-150',
          render: (record) => <Text size="normal">{record.transmission}</Text>,
        },
      ];
    }

    return columns;
  };

  onFinish = (values) => {
    const { busPlaces, busId } = this.state;
    const {
      dispatch,
      match: { params },
    } = this.props;
    const payload = {
      ...values,
      id: params.id,
      busPlaces: busPlaces.map((item) => ({
        ...item,
        studentBusPlaces: item.studentBusPlaces.map((itemBus, index) => ({
          studentId: itemBus.id,
          address: itemBus.address,
          description: itemBus.description,
          orderNo: index,
        })),
      })),
      busRouteShedules: values.busRouteShedules.map((item) => ({
        dayOfWeek: item,
      })),
      busRouteNannies: values.busRouteNannies.map((item) => ({
        nannyId: item,
      })),
      busId: busId,
    };
    dispatch({
      type: params.id ? 'tutorialAdd/UPDATE' : 'tutorialAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  onSubmitMaps = (values) => {
    const { listId } = this.state;
    this.setStateData((prevState) => ({
      busPlaces: prevState.busPlaces.map((item) => {
        if (item.id === listId) {
          return {
            ...item,
            ...values,
          };
        }
        return item;
      }),
      visibleMap: false,
    }));
  };

  enabledSubmit = () => {
    const { busPlaces } = this.state;
    const itemBusValidate = busPlaces.find(
      (item) => !item.address || isEmpty(item.studentBusPlaces),
    );
    return !!itemBusValidate;
  };

  render() {
    const { busPlaces, visible, listId, studentBusPlaces, visibleMap, bus, busId } = this.state;
    const {
      menuData,
      branches,
      busInformations,
      employees,
      students,
      loading: { effects },
    } = this.props;
    const loading = effects['tutorialAdd/GET_DATA'];
    const loadingSubmit = effects['tutorialAdd/ADD'] || effects['tutorialAdd/UPDATE'];
    return (
      <>
        <Breadcrumbs last="Chi tiết lộ trình" menu={menuData} />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          initialValues={{}}
          colon={false}
          onFinish={this.onFinish}
          ref={this.formRef}
        >
          {visible && (
            <Children
              visible={visible}
              listId={listId}
              students={students}
              onSave={this.onSave}
              handleCancel={this.handleCancel}
              studentBusPlaces={studentBusPlaces}
            />
          )}
          {visibleMap && (
            <Maps
              visible={visibleMap}
              handleCancel={this.handleCancelMap}
              onSubmit={this.onSubmitMaps}
            />
          )}
          <div className={styles['content-form']}>
            <div className={classnames(styles['content-children'], 'mt0')}>
              <Text color="dark" size="large-medium">
                THÔNG TIN CHUNG
              </Text>
              <div className="row">
                <div className="col-lg-9">
                  <FormItem
                    label="TÊN LỘ TRÌNH"
                    name="name"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={branches}
                    label="ĐIỂM XUẤT PHÁT"
                    name="startedPlace"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
              </div>
            </div>
            <div className={styles['content-children']}>
              <div className="d-flex justify-content-between align-items-center mb20">
                <Text color="dark" size="large-medium">
                  THÔNG TIN XE
                </Text>
                <Select
                  value={busId}
                  dataSet={busInformations}
                  style={{ width: '200px' }}
                  placeholder="Chọn xe"
                  onChange={this.onChangeBus}
                />
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <FormItem
                    data={variablesModules.DAYS}
                    label="Thời gian lặp lại của lộ trình"
                    name="busRouteShedules"
                    type={variables.SELECT_MUTILPLE}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    label="Thời gian bắt đầu"
                    name="startDate"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    label="Thời gian kết thúc"
                    name="endDate"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <Table
                    bordered
                    columns={this.header()}
                    dataSource={bus}
                    className="table-edit"
                    isEmpty
                    pagination={false}
                    params={{
                      header: this.header(),
                      type: 'table',
                    }}
                    rowKey={(record) => record.id}
                    scroll={{ x: '100%' }}
                  />
                </div>
              </div>
              <hr />
              <Text color="dark" size="large-medium">
                THÔNG TIN BẢO MẪU
              </Text>
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    data={Helper.convertSelectUsers(employees)}
                    label="BẢO MẪU"
                    name="busRouteNannies"
                    type={variables.SELECT_MUTILPLE}
                    rules={[variables.RULES.EMPTY]}
                  />
                </div>
              </div>
            </div>
            <div className={classnames(styles['list-info'], 'mt-5')}>
              {busPlaces.map((item, index) => (
                <div
                  className={classnames(styles.item, { [`${styles.collapsed}`]: item.collapsed })}
                  key={index}
                >
                  <div
                    className={classnames(
                      styles.heading,
                      'd-flex',
                      'justify-content-between',
                      'align-items-center',
                    )}
                  >
                    <div className="d-flex align-items-center">
                      <Text color="dark" size="large" style={{ whiteSpace: 'nowrap' }}>
                        ĐIỂM ĐÓN SỐ {index + 1}
                      </Text>
                      <Input
                        className="ml-3"
                        size="large"
                        value={item.address}
                        style={{ width: '400px' }}
                        suffix={
                          <span
                            className={classnames('icon-map', styles['icon-map'])}
                            onClick={() => this.showMap(item)}
                          ></span>
                        }
                      />
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className={styles['list-button']}>
                        <Button
                          color="danger"
                          icon="remove"
                          onClick={() => this.onRemove(item.id)}
                        />
                        <Button color="dark" icon="up" onClick={() => this.collapsed(item)} />
                      </div>
                    </div>
                  </div>
                  <div className={styles['content-block']}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Text color="dark" size="large-medium">
                        DS TRẺ TẠI ĐIỂM ĐÓN
                      </Text>
                      <Button color="success" icon="edit" onClick={() => this.onEditList(item)}>
                        Cập nhật danh sách
                      </Button>
                    </div>
                    <Table
                      bordered
                      columns={this.header('CHILDREN')}
                      dataSource={item.studentBusPlaces || []}
                      className="table-edit"
                      pagination={false}
                      isEmpty
                      params={{
                        header: this.header('CHILDREN'),
                        type: 'table',
                      }}
                      rowKey={(record) => record.id || record.key}
                      scroll={{ x: '100%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4" color="success" icon="plus" onClick={this.addList}>
              Thêm điểm đón
            </Button>
            <div className={classnames('d-flex', 'justify-content-center', 'mt-4')}>
              <Button
                color="gray"
                icon="prev"
                onClick={() => history.goBack()}
                size="large"
                className="mr-3"
                loading={loadingSubmit}
              >
                HỦY
              </Button>
              <Button
                color="green"
                htmlType="submit"
                icon="save"
                size="large"
                loading={loadingSubmit}
                disabled={!busId || this.enabledSubmit()}
              >
                LƯU
              </Button>
            </div>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {};

export default Index;
