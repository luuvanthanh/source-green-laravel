import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Form, Input, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, head } from 'lodash';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import classnames from 'classnames';
import { Helper } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import styles from '@/assets/styles/Common/common.scss';
import { v4 as uuidv4 } from 'uuid';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Maps from './maps';
import Children from './children';

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
const mapStateToProps = ({ tutorialAddV2, loading, menu }) => ({
  loading,
  error: tutorialAddV2.error,
  details: tutorialAddV2.details,
  menuData: menu.menuLeftSchedules,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { details } = props;
    this.state = {
      visibleMap: false,
      busPlaces: !isEmpty(details?.busPlaces)
        ? details?.busPlaces.map((item) => ({
            address: item.address,
            lat: item.lat,
            lng: item.long,
            orderNo: item.orderNo,
            studentBusPlaces: item.studentBusPlaces.map((itemStudent) => ({
              ...itemStudent,
              ...itemStudent.student,
              transporterId: head(itemStudent?.student?.studentTransporter)?.id,
            })),
          }))
        : [
            {
              id: uuidv4(),
              studentBusPlaces: [],
            },
          ],
      listId: null,
      position: [],
      students: [],
      visible: false,
    };
    setIsMounted(true);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.onSetLatLngDefault(position);
    });
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

  onSetLatLngDefault = (position) => {
    if (isEmpty(this.state.position)) {
      this.setStateData({
        position: [position.coords.latitude, position.coords.longitude],
      });
    }
  };

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tutorialAddV2/GET_STUDENTS',
      payload: {
        classStatus: 'HAS_CLASS',
      },
      callback: (response) => {
        if (response) {
          this.setStateData({
            students: response.items,
          });
        }
      },
    });
  };

  showMap = (record) => {
    this.setStateData((prevState) => ({
      visibleMap: true,
      listId: record.id,
      position: record.lat && record.lng ? [record.lat, record.lng] : prevState.position,
    }));
  };

  handleCancelMap = () => {
    this.setStateData({
      visibleMap: false,
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

  onChangeAddress = (event, record) => {
    this.setStateData((prevState) => ({
      busPlaces: prevState.busPlaces.map((item) => {
        if (item.id === record.id) {
          return {
            ...item,
            address: event.target.value,
          };
        }
        return item;
      }),
    }));
  };

  /**
   * Function save table cancel
   */
  addList = () => {
    this.setStateData((prevState) => ({
      busPlaces: [...prevState.busPlaces, { id: uuidv4(), studentBusPlaces: [] }],
    }));
  };

  onRemove = (id) => {
    this.setStateData((prevState) => ({
      busPlaces: prevState.busPlaces.filter((item) => item.id !== id),
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

  enableStudents = (items) => {
    const { busPlaces } = this.state;
    let studentBusPlaces = [];
    busPlaces.forEach((item) => {
      studentBusPlaces = [...studentBusPlaces, ...item.studentBusPlaces];
    });
    return items.filter(
      (item) => !studentBusPlaces.find((itemStudent) => itemStudent.id === item.id),
    );
  };

  /**
   * Function edit list
   * @param {uid} id id of items
   */
  onEditList = (record) => {
    this.setStateData((prevState) => ({
      visible: true,
      listId: record.id,
      studentBusPlaces: record.studentBusPlaces.map((item) => item.id),
      students: [...this.enableStudents(prevState.students), ...record.studentBusPlaces],
    }));
  };

  handleCancel = () => {
    this.setStateData({
      visible: false,
      listId: null,
      studentBusPlaces: [],
      students: [],
    });
  };

  onRemoveChildren = (record, object) => {
    this.setStateData((prevState) => ({
      busPlaces: prevState.busPlaces.map((item) => {
        if (item.parentId === object.parentId) {
          return {
            ...item,
            studentBusPlaces: item.studentBusPlaces.filter(
              (itemChildren) => itemChildren.key !== record.key,
            ),
          };
        }
        return item;
      }),
    }));
  };

  onChangeCheckbox = (record, object, key = 'isSchoolWard') => {
    this.setStateData((prevState) => ({
      busPlaces: prevState.busPlaces.map((item) => {
        if (item.parentId === object.parentId) {
          return {
            ...item,
            studentBusPlaces: item.studentBusPlaces.map((itemStudent) =>
              itemStudent.id === record.id
                ? { ...itemStudent, [key]: !itemStudent[key] }
                : itemStudent,
            ),
          };
        }
        return item;
      }),
    }));
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
            studentBusPlaces: items.map((itemStudent) => ({
              ...itemStudent,
              transporterId: head(itemStudent.studentTransporter)?.id,
            })),
            parentId: listId,
          };
        }
        return item;
      }),
      visible: false,
    }));
  };

  /**
   * Function header table
   */
  header = (object) => {
    let columns = [];
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
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.fileImage)}
            fullName={record.fullName}
          />
        ),
      },
      {
        title: 'NGƯỜI ĐƯA ĐÓN',
        key: 'studentTransporte',
        className: 'min-width-200',
        render: (record) => {
          const itemTransport = head(record.studentTransporter);
          if (itemTransport) {
            return (
              <AvatarTable
                fileImage={Helper.getPathAvatarJson(itemTransport.fileImage)}
                fullName={itemTransport.fullName}
              />
            );
          }
          return null;
        },
      },
      {
        title: 'CHIỀU ĐƯA ĐÓN',
        key: 'route',
        children: [
          {
            title: 'ĐI',
            key: 'isSchoolWard',
            className: 'min-width-80',
            align: 'center',
            render: (record) => (
              <Checkbox
                checked={record.isSchoolWard}
                onClick={() => this.onChangeCheckbox(record, object, 'isSchoolWard')}
              />
            ),
          },
          {
            title: 'VỀ',
            key: 'isHomeWard',
            className: 'min-width-80',
            align: 'center',
            render: (record) => (
              <Checkbox
                checked={record.isHomeWard}
                onClick={() => this.onChangeCheckbox(record, object, 'isHomeWard')}
              />
            ),
          },
        ],
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="danger"
              icon="remove"
              onClick={() => this.onRemoveChildren(record, object)}
            />
          </div>
        ),
      },
    ];

    return columns;
  };

  onFinish = () => {
    const {
      dispatch,
      match: { params },
      details,
    } = this.props;
    const { busPlaces } = this.state;
    dispatch({
      type: 'tutorialAddV2/UPDATE',
      payload: {
        ...details,
        id: params?.id,
        busPlaces: busPlaces.map((item, index) => ({
          address: item.address,
          lat: item.lat,
          long: item.lng,
          orderNo: index + 1,
          studentBusPlaces: item.studentBusPlaces.map((itemBus, indexStudent) => ({
            orderNo: indexStudent + 1,
            studentId: itemBus.id,
            classId: itemBus.classId,
            address: itemBus.address,
            isHomeWard: itemBus.isHomeWard,
            description: itemBus.description,
            isSchoolWard: itemBus.isSchoolWard,
            transporterId: itemBus.transporterId,
          })),
        })),
      },
      callback: (response, error) => {
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              this.formRef.current.setFields([
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

  enabledSubmit = () => {
    const { busPlaces } = this.state;
    const itemBusValidate = busPlaces.find(
      (item) => !item.address || isEmpty(item.studentBusPlaces),
    );
    return !!itemBusValidate;
  };

  render() {
    const {
      error,
      details,
      loading: { effects },
    } = this.props;
    const {
      visibleMap,
      busPlaces,
      position,
      visible,
      listId,
      students,
      studentBusPlaces,
    } = this.state;
    const loading =
      effects['tutorialAddV2/GET_DETAILS'] || effects['tutorialAddV2/GET_BUS_INFORMATIONS'];
    const loadingSubmit = effects['tutorialAddV2/ADD'] || effects['tutorialAddV2/UPDATE'];

    return (
      <Form
        layout="vertical"
        ref={this.formRef}
        initialValues={{
          ...details,
          busId: details?.busTransportations?.find((item) => item.isMain)?.busId,
        }}
        onFinish={this.onFinish}
      >
        {visibleMap && (
          <Maps
            visible={visibleMap}
            handleCancel={this.handleCancelMap}
            onSubmit={this.onSubmitMaps}
            position={position}
          />
        )}
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
        <div className="card">
          <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title">Danh sách điểm đón</Heading>
              <div className={classnames(styles['list-info'])}>
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
                        <h3 className={styles.title}>ĐIỂM ĐÓN SỐ {index + 1}</h3>
                        <Input
                          className="ml-3"
                          size="large"
                          value={item.address}
                          style={{ width: '400px' }}
                          onChange={(event) => this.onChangeAddress(event, item)}
                          suffix={
                            !isEmpty(position) && (
                              <span
                                className={classnames('icon-map', styles['icon-map'])}
                                role="presentation"
                                onClick={() => this.showMap(item)}
                              />
                            )
                          }
                        />
                      </div>
                      <div className="d-flex justify-content-end">
                        <div className={styles['list-button']}>
                          <Button
                            color="grey"
                            icon="remove"
                            onClick={() => this.onRemove(item.id)}
                          />
                          <Button color="grey" icon="up" onClick={() => this.collapsed(item)} />
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
                        columns={this.header(item)}
                        dataSource={item.studentBusPlaces || []}
                        className="table-edit"
                        pagination={false}
                        isEmpty
                        params={{
                          header: this.header(item),
                          type: 'table',
                        }}
                        rowKey={(record) => record.id || record.key}
                        scroll={{ x: '100%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <hr />
              <p className={styles['button-plus']} role="presentation" onClick={this.addList}>
                <span className="icon-plus-circle" /> THÊM ĐIỂM ĐÓN
              </p>
            </div>

            <div className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              <Button
                color="success"
                size="large"
                htmlType="submit"
                loading={loadingSubmit}
                disabled={
                  !details?.busTransportations?.find((item) => item.isMain)?.busId &&
                  this.enabledSubmit()
                }
              >
                Lưu
              </Button>
            </div>
          </Loading>
        </div>
      </Form>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  details: {},
};

export default withRouter(Index);
