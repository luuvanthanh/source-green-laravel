import React, { PureComponent } from 'react';
import { connect, withRouter } from 'umi';
import { Form, Avatar, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, head } from 'lodash';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import Select from '@/components/CommonComponent/Select';
import styles from '@/assets/styles/Common/common.scss';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

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
  busInformations: tutorialAddV2.busInformations,
  menuData: menu.menuLeftSchedules,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { details } = props;
    this.state = {
      busTransportations:
        details?.busTransportations?.map((item) => ({
          ...item,
          ...item.busInfor,
          id: uuidv4(),
        })) || [],
    };
    setIsMounted(true);
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

  componentDidMount() {
    this.loadCategories();
  }

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tutorialAddV2/GET_BUS_INFORMATIONS',
      payload: {},
    });
  };

  /**
   * Function header table
   */
  header = () => {
    let columns = [];
    columns = [
      {
        title: 'MÃ SỐ',
        key: 'code',
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record.code}</Text>,
      },
      {
        title: 'HÃNG',
        key: 'manufacturer',
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record.manufacturer}</Text>,
      },
      {
        title: 'SỐ CHỔ NGỒI',
        key: 'seats',
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record.seats} chỗ</Text>,
      },
      {
        title: 'XE',
        key: 'bus',
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
        className: 'min-width-100',
        render: (record) => <Text size="normal"> {record.year}</Text>,
      },
      {
        title: 'TRUYỀN ĐỘNG',
        key: 'movement',
        className: 'min-width-100',
        render: (record) => <Text size="normal">{record.transmission}</Text>,
      },
    ];

    return columns;
  };

  onChangeBus = (value) => {
    const { busInformations } = this.props;
    const itemBus = busInformations.find((item) => item.id === value);
    this.setStateData((prevState) => ({
      busTransportations: prevState.busTransportations?.find((item) => item.isMain)
        ? prevState?.busTransportations?.map((item) =>
            item.isMain ? { ...itemBus, busId: itemBus.id, isMain: true } : item,
          )
        : [...prevState.busTransportations, itemBus],
    }));
  };

  onChangeBusChildren = (value, record) => {
    const { busInformations } = this.props;
    const itemBus = busInformations.find((item) => item.id === value);
    this.setStateData((prevState) => ({
      busTransportations: prevState.busTransportations.map((item) =>
        item.id === record.id ? { ...itemBus, busId: itemBus.id, id: item.id } : item,
      ),
    }));
  };

  onChangeDate = (value, record, key = 'startDate') => {
    this.setStateData((prevState) => ({
      busTransportations: prevState.busTransportations.map((item) =>
        item.id === record.id ? { ...item, [key]: value } : item,
      ),
    }));
  };

  onAdd = () => {
    this.setStateData(
      (prevState) => ({
        busTransportations: [...prevState.busTransportations, { id: uuidv4() }],
      }),
      () => {
        document
          .getElementById('scroll-container')
          .scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      },
    );
  };

  onRemove = (id) => {
    this.setStateData((prevState) => ({
      busTransportations: prevState.busTransportations.filter((item) => item.id !== id),
    }));
  };

  onFinish = () => {
    const {
      dispatch,
      match: { params },
      details,
    } = this.props;
    const { busTransportations } = this.state;
    dispatch({
      type: 'tutorialAddV2/UPDATE',
      payload: {
        ...details,
        id: params?.id,
        busTransportations: busTransportations.map((item, index) => ({
          orderNo: index + 1,
          busId: item.busId,
          startDate: !item.isMain
            ? Helper.getDateTime({
                value: Helper.setDate({
                  ...variables.setDateData,
                  originValue: item.startDate,
                  targetValue: '00:00:00',
                }),
                isUTC: true,
              })
            : undefined,
          endDate: !item.isMain
            ? Helper.getDateTime({
                value: Helper.setDate({
                  ...variables.setDateData,
                  originValue: item.endDate,
                  targetValue: '23:59:59',
                }),
                isUTC: true,
              })
            : undefined,
          isMain: item.isMain,
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

  disabledDateTo = (current, startDate) => {
    if (startDate) {
      if (startDate) return current && current < moment(startDate).startOf('day');
      return null;
    }
    return null;
  };

  disabledDateFrom = (current, endDate) => {
    if (endDate) {
      if (endDate) return current && current >= moment(endDate).startOf('day');
      return null;
    }
    return null;
  };

  enableButton = (items) =>
    !!items.find(
      (item) =>
        (item.isMain && !item.busId) ||
        (!item.isMain && (!item.busId || !item.startDate || !item.endDate)),
    );

  render() {
    const {
      error,
      details,
      busInformations,
      loading: { effects },
    } = this.props;
    const { busTransportations } = this.state;
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
        <div className="card">
          <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title">Thông tin xe</Heading>
              <div className="row">
                <div className="col-lg-12">
                  <FormItem
                    data={busInformations}
                    name="busId"
                    label="Chọn xe"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                    onChange={this.onChangeBus}
                  />
                </div>
              </div>
              {!isEmpty(busTransportations) && (
                <div className="row">
                  <div className="col-lg-12">
                    <Table
                      bordered
                      columns={this.header()}
                      dataSource={busTransportations.filter((item) => item.isMain)}
                      className="table-edit"
                      isEmpty
                      pagination={false}
                      loading={loading}
                      params={{
                        header: this.header(),
                        type: 'table',
                      }}
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                    />
                  </div>
                </div>
              )}
              <hr />
              <Scrollbars
                autoHeight
                autoHeightMax={window.innerHeight - 650}
                renderTrackHorizontal={(props) => (
                  <div {...props} className="track-horizontal" style={{ display: 'none' }} />
                )}
                renderThumbHorizontal={(props) => (
                  <div {...props} className="thumb-horizontal" style={{ display: 'none' }} />
                )}
              >
                <div id="scroll-container">
                  <Heading type="form-title">Thông tin xe bổ sung</Heading>
                  {!isEmpty(busTransportations.filter((item) => !item.isMain)) &&
                    busTransportations
                      ?.filter((item) => !item.isMain)
                      ?.map((item, index) => (
                        <div key={index} className="mt10">
                          <div className="d-flex justify-content-between align-items-center pr10">
                            <Heading type="form-block-title">Xe bổ sung {index + 1}</Heading>
                            <button
                              type="button"
                              className={styles['button-remove']}
                              onClick={() => this.onRemove(item.id)}
                            >
                              <span className="icon-remove" />
                            </button>
                          </div>

                          <div className="row">
                            <div className="col-lg-6">
                              <div className="d-block ant-col ant-form-item-label">
                                <label htmlFor="busId" className="ant-form-item-required" title="">
                                  <span>Chọn xe</span>
                                </label>
                              </div>
                              <Select
                                dataSet={busInformations}
                                style={{ width: '100%' }}
                                placeholder="Chọn"
                                value={item.busId}
                                onChange={(value) => this.onChangeBusChildren(value, item)}
                              />
                            </div>
                            <div className="col-lg-3">
                              <div className="d-block ant-col ant-form-item-label">
                                <label htmlFor="busId" className="ant-form-item-required" title="">
                                  <span>Thời gian bắt đầu</span>
                                </label>
                              </div>
                              <DatePicker
                                format={variables.DATE_FORMAT.DATE}
                                value={item.startDate && moment(item.startDate)}
                                onChange={(value) => this.onChangeDate(value, item, 'startDate')}
                                disabledDate={(current) =>
                                  this.disabledDateFrom(current, item.endDate)
                                }
                              />
                            </div>
                            <div className="col-lg-3">
                              <div className="d-block ant-col ant-form-item-label">
                                <label htmlFor="busId" className="ant-form-item-required" title="">
                                  <span>Thời gian kết thúc</span>
                                </label>
                              </div>
                              <DatePicker
                                format={variables.DATE_FORMAT.DATE}
                                value={item.endDate && moment(item.endDate)}
                                onChange={(value) => this.onChangeDate(value, item, 'endDate')}
                                disabledDate={(current) =>
                                  this.disabledDateTo(current, item.startDate)
                                }
                              />
                            </div>
                          </div>
                          <Table
                            bordered
                            columns={this.header()}
                            dataSource={item.busId ? [item] : []}
                            className="table-edit mt10"
                            isEmpty
                            pagination={false}
                            loading={loading}
                            params={{
                              header: this.header(),
                              type: 'table',
                            }}
                            rowKey={(record) => record.id}
                            scroll={{ x: '100%' }}
                          />
                        </div>
                      ))}
                </div>
              </Scrollbars>
              <hr />
              <p className={styles['button-plus']} role="presentation" onClick={() => this.onAdd()}>
                <span className="icon-plus-circle" /> THÊM XE BỔ SUNG
              </p>
            </div>

            <div className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              <Button
                color="success"
                size="large"
                htmlType="submit"
                loading={loadingSubmit}
                disabled={this.enableButton(busTransportations)}
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
  busInformations: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  dispatch: {},
  error: {},
  details: {},
  busInformations: [],
};

export default withRouter(Index);
