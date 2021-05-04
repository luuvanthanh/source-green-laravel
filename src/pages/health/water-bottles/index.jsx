import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Typography, Form, Modal } from 'antd';
import classnames from 'classnames';
import { isEmpty, head, debounce } from 'lodash';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { get } from 'lodash';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { DeleteOutlined } from '@ant-design/icons';

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
const { Paragraph } = Typography;
const mapStateToProps = ({ waterBottles, loading }) => ({
  data: waterBottles.data,
  pagination: waterBottles.pagination,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  formRefModal = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      visible: false,
      search: {
        action: query?.action,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
      },
      objects: {},
      waterBottles: [],
      student: {},
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
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
    const { search, status } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'waterBottles/GET_DATA',
      payload: {
        ...search,
        status,
      },
    });
    history.push(`${pathname}?${Helper.convertParamSearchConvert(search, variables.QUERY_STRING)}`);
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

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  pagination = (pagination) => ({
    size: 'default',
    total: pagination.total,
    pageSize: variables.PAGINATION.PAGE_SIZE,
    defaultCurrent: Number(this.state.search.page),
    current: Number(this.state.search.page),
    hideOnSinglePage: pagination.total <= 10,
    showSizeChanger: variables.PAGINATION.SHOW_SIZE_CHANGER,
    pageSizeOptions: variables.PAGINATION.PAGE_SIZE_OPTIONS,
    locale: { items_per_page: variables.PAGINATION.PER_PAGE_TEXT },
    onChange: (page, size) => {
      this.changePagination(page, size);
    },
    onShowSizeChange: (current, size) => {
      this.changePagination(current, size);
    },
    showTotal: (total, [start, end]) => `Hiển thị ${start}-${end} trong ${total}`,
  });

  /**
   * Function header table
   */
  header = () => {
    return [
      {
        title: 'Cơ sở',
        key: 'branch',
        className: 'min-width-150',
        render: (record) => record?.student?.class?.branch?.name,
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-150',
        render: (record) => record?.student?.class?.name,
      },
      {
        title: 'Trẻ',
        key: 'name',
        className: 'min-width-200',
        render: (record) => (
          <AvatarTable
            fileImage={Helper.getPathAvatarJson(get(record, 'student.fileImage'))}
            fullName={get(record, 'student.fullName')}
          />
        ),
      },
      {
        title: 'Bình nước',
        key: 'type',
        className: 'min-width-150',
        render: (record) => record?.type + ` ml`,
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button color="success" onClick={() => this.showWater(record)}>
              Cấu hình
            </Button>
          </div>
        ),
      },
    ];
  };

  showWater = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'waterBottles/GET_WATER_BOTTLES',
      payload: {
        studentId: record?.student?.id,
      },
      callback: (response, error) => {
        if (response) {
          this.setStateData(
            {
              visible: true,
              waterBottles: response,
              student: head(response)?.student,
            },
            () => {
              this.formRefModal.current.setFieldsValue({
                data: response.map((item) => ({
                  ...item,
                  applyDate: moment(item.applyDate),
                })),
              });
            },
          );
        }
      },
    });
  };

  handleCancel = () => {
    this.setStateData({
      visible: false,
    });
  };

  saveWaterBottles = () => {
    const { dispatch } = this.props;
    const { student } = this.state;
    this.formRefModal.current.validateFields().then((values) => {
      if (isEmpty(values.data.filter((item) => !item.isUsing))) {
        message.error('Vui lòng kiểm tra lại dữ liệu');
        return;
      }
      dispatch({
        type: 'healthUpdate/WATER_BOTTLES',
        payload: {
          reportDate: moment(),
          data: values.data
            .filter((item) => !item.isUsing)
            .map((item) => ({
              studentId: student?.id,
              type: item.type,
              applyDate: item.applyDate,
            })),
        },
        callback: (response) => {
          if (response) {
            this.onLoad();
            this.setStateData({
              visible: false,
            });
          }
        },
      });
    });
  };

  render() {
    const {
      data,
      pagination,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, visible, waterBottles } = this.state;
    const loading = effects['waterBottles/GET_DATA'];
    const loadingSubmit = effects['waterBottles/WATER_BOTTLES'];
    return (
      <>
        <Modal
          centered
          footer={[
            <div className={classnames('d-flex', 'justify-content-end')} key="action">
              <Button
                color="white"
                icon="cross"
                loading={loadingSubmit}
                onClick={this.handleCancel}
                size="large"
              >
                HỦY
              </Button>
              <Button
                color="green"
                icon="save"
                loading={loadingSubmit}
                onClick={this.saveWaterBottles}
                size="large"
              >
                LƯU
              </Button>
            </div>,
          ]}
          onCancel={this.handleCancel}
          title={'CẤU HÌNH BÌNH NƯỚC'}
          visible={visible}
        >
          <Form
            layout="vertical"
            ref={this.formRefModal}
            initialValues={{
              data: !isEmpty(waterBottles)
                ? waterBottles.map((item) => ({
                    ...item,
                    applyDate: moment(item.applyDate),
                  }))
                : [{}],
            }}
          >
            <div className="row">
              <div className="col-lg-12">
                <Form.List name="data">
                  {(fields, { add, remove }) => (
                    <div>
                      {fields.map((field, index) => {
                        let itemWaterBottles = {};
                        if (this.formRefModal.current) {
                          const { data } = this.formRefModal.current.getFieldsValue();
                          const itemData = data?.find((item, indexWater) => indexWater === index);
                          itemWaterBottles = waterBottles.find((item) => item.id === itemData?.id);
                        }
                        return (
                          <div
                            className={classnames(
                              'row',
                              styles['form-item'],
                              styles['form-item-advance'],
                            )}
                            key={field.key}
                          >
                            <div className="col-lg-6">
                              <FormItem
                                label="Loại bình (số ml)"
                                name={[field.name, 'type']}
                                fieldKey={[field.fieldKey, 'type']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.INPUT_COUNT}
                                disabled={
                                  itemWaterBottles?.applyDate
                                    ? moment(itemWaterBottles.applyDate) <= moment().endOf('day')
                                    : false
                                }
                              />
                            </div>
                            <div className="col-lg-6">
                              <FormItem
                                label="Ngày áp dụng"
                                name={[field.name, 'applyDate']}
                                fieldKey={[field.fieldKey, 'applyDate']}
                                rules={[variables.RULES.EMPTY]}
                                type={variables.DATE_PICKER}
                                disabled={
                                  itemWaterBottles?.applyDate
                                    ? moment(itemWaterBottles.applyDate) <= moment().endOf('day')
                                    : false
                                }
                              />
                            </div>
                            <>
                              {fields?.length > 1 ? (
                                <DeleteOutlined
                                  className={classnames(styles['icon-delete'], 'ml-1')}
                                  onClick={() => {
                                    remove(field.name);
                                  }}
                                />
                              ) : null}
                            </>
                          </div>
                        );
                      })}
                      <div className="row mb-3">
                        <div className="col-lg-3">
                          <Button
                            color="success"
                            icon="plusMain"
                            onClick={() => {
                              add();
                            }}
                          >
                            Thêm dòng
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </Form.List>
              </div>
            </div>
          </Form>
        </Modal>
        <Helmet title="Cấu hình bình nước" />
        <div className={classnames(styles['content-form'], styles['content-form-waterBottles'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Cấu hình bình nước</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-4">
                  <FormItem
                    name="user_id"
                    data={[]}
                    onChange={(event) => this.onChangeSelect(event, 'user_id')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    name="startDate"
                    onChange={(event) => this.onChangeSelect(event, 'startDate')}
                    type={variables.DATE_PICKER}
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
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
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
};

export default Index;
