import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Upload, message } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty, last, head } from 'lodash';
import moment from 'moment';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper, variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import PropTypes from 'prop-types';

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
const mapStateToProps = ({ menu, childrenHRMAdd, loading }) => ({
  loading,
  categories: childrenHRMAdd.categories,
  details: childrenHRMAdd.details,
  error: childrenHRMAdd.error,
  menuData: menu.menuLeftHRM,
});

@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      fileImage: [],
    };
    setIsMounted(true);
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;
    if (params.id) {
      dispatch({
        type: 'childrenHRMAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
      });
    }
    this.loadCategories();
  }

  componentDidUpdate(prevProps) {
    const {
      details,
      match: { params },
    } = this.props;
    if (details !== prevProps.details && !isEmpty(details) && get(params, 'id')) {
      this.formRef.current.setFieldsValue({
        ...details,
        data: [
          {
            ...details,
            birthday: details.birthday && moment(details.birthday),
            date: details.dedectionTimeFrom &&
              details.dedectionTimeTo && [
                moment(details.dedectionTimeFrom),
                moment(details.dedectionTimeTo),
              ],
          },
        ],
      });
      this.onSetFileImage(details?.fileImage);
    }
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

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'childrenHRMAdd/GET_CATEGORIES',
      payload: {},
    });
  };

  onSetFileImage = (fileImage) => {
    this.setStateData({
      fileImage: Helper.isJSON(fileImage) ? JSON.parse(fileImage) : [],
    });
  };

  onFinish = (values) => {
    const {
      dispatch,
      match: { params },
    } = this.props;
    const { fileImage } = this.state;
    dispatch({
      type: params.id ? 'childrenHRMAdd/UPDATE' : 'childrenHRMAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        data: values.data.map((item) => ({
          ...item,
          birthday: moment(item.birthday).format(variables.DATE_FORMAT.DATE_AFTER),
          dedectionTimeFrom:
            head(item.date) && moment(head(item.date)).format(variables.DATE_FORMAT.DATE_AFTER),
          dedectionTimeTo:
            last(item.date) && moment(last(item.date)).format(variables.DATE_FORMAT.DATE_AFTER),
          fileImage: !isEmpty(fileImage) ? JSON.stringify(fileImage) : undefined,
        })),
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
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
  };

  onRemoFile = (record) => {
    this.setStateData((prevState) => ({
      fileImage: prevState.fileImage.filter((item) => item.id !== record.id),
    }));
  };

  onUpload = (files) => {
    this.props.dispatch({
      type: 'upload/UPLOAD',
      payload: files,
      callback: (response) => {
        if (response) {
          this.setStateData((prevState) => ({
            fileImage: [...prevState.fileImage, head(response.results)?.fileInfo],
          }));
        }
      },
    });
  };

  render() {
    const {
      error,
      categories,
      menuData,
      loading: { effects },
      match: { params },
    } = this.props;
    const { fileImage } = this.state;
    const loading =
      effects['childrenHRMAdd/GET_CATEGORIES'] || effects['childrenHRMAdd/GET_DETAILS'];
    const loadingSubmit = effects['childrenHRMAdd/ADD'] || effects['childrenHRMAdd/UPDATE'];
    const self = this;
    const props = {
      beforeUpload() {
        return null;
      },
      customRequest({ file }) {
        const { name, size } = file;
        const allowTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpeg', 'jpg', 'png'];
        const maxSize = 5 * 2 ** 20;
        if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
          message.error(
            'Định dạng hỗ trợ: .pdf, .doc, .docx, .xls, .xlsx, .jpeg, .jpg, .png. Tổng dung lượng không vượt quá 20MB',
          );
          return;
        }
        self.onUpload(file);
      },
      showUploadList: false,
      fileList: [],
    };
    return (
      <>
        <Breadcrumbs
          last={
            params.id ? 'Chỉnh sửa thông tin con của nhân viên' : 'Tạo thông tin con của nhân viên'
          }
          menu={menuData}
        />
        <Form
          className={styles['layout-form']}
          layout="vertical"
          ref={this.formRef}
          initialValues={{
            data: [{}],
          }}
          onFinish={this.onFinish}
        >
          <div className={styles['content-form']}>
            <Loading
              loading={loading}
              isError={error.isError}
              params={{ error, goBack: '/quan-ly-nhan-su/thong-ke-con-cua-nhan-vien' }}
            >
              <div className={classnames(styles['content-children'], 'mt10')}>
                <Text color="dark" size="large-medium">
                  THÔNG TIN CHUNG
                </Text>
                <div className="row mt-3">
                  <div className="col-lg-6">
                    <FormItem
                      data={Helper.convertSelectUsers(categories?.users)}
                      label="NHÂN VIÊN"
                      name="employeeId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                    />
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-lg-12">
                    <Form.List name="data">
                      {(fields, { _ }) => (
                        <div>
                          {fields.map((field, _index) => (
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
                                  label="HỌ VÀ TÊN"
                                  name={[field.name, 'fullName']}
                                  fieldKey={[field.fieldKey, 'fullName']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.INPUT}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormItem
                                  label="NGÀY SINH"
                                  name={[field.name, 'birthday']}
                                  fieldKey={[field.fieldKey, 'birthday']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.DATE_PICKER}
                                  disabledDate={Helper.disabledDateFuture}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormItem
                                  label="GIỚI TÍNH"
                                  name={[field.name, 'gender']}
                                  fieldKey={[field.fieldKey, 'gender']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.INPUT}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormItem
                                  label="MỐI QUAN HỆ"
                                  name={[field.name, 'relationship']}
                                  fieldKey={[field.fieldKey, 'relationship']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.INPUT}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormItem
                                  label="MÃ SỐ THUẾ"
                                  name={[field.name, 'taxCode']}
                                  fieldKey={[field.fieldKey, 'taxCode']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.INPUT}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormItem
                                  label="THỜI GIAN BẮT ĐẦU TÍNH GIẢM TỪ"
                                  name={[field.name, 'date']}
                                  fieldKey={[field.fieldKey, 'date']}
                                  rules={[variables.RULES.EMPTY]}
                                  type={variables.RANGE_PICKER}
                                />
                              </div>
                              <div className="col-lg-6">
                                <FormItem
                                  className="checkbox-row checkbox-small"
                                  label="NGƯỜI PHỤ THUỘC"
                                  name={[field.name, 'isDependentPerson']}
                                  fieldKey={[field.fieldKey, 'isDependentPerson']}
                                  type={variables.CHECKBOX_FORM}
                                  valuePropName="checked"
                                />
                              </div>
                              <div className="col-lg-12">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <label className="ant-col ant-form-item-label d-block">
                                      <span>Đính kèm file</span>
                                    </label>
                                    <Upload {...props}>
                                      <Button color="primary" icon="upload1">
                                        Tải lên
                                      </Button>
                                    </Upload>
                                    {!isEmpty(fileImage) && (
                                      <div className={classnames(styles['files-container'], 'mt5')}>
                                        {fileImage.map((item) => (
                                          <div className={styles.item} key={item.id}>
                                            <a
                                              href={`${API_UPLOAD}${item.url}`}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              {item.name}
                                            </a>
                                            <span
                                              role="presentation"
                                              className="icon-cross"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                this.onRemoFile(item);
                                              }}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Form.List>
                  </div>
                </div>
              </div>
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
                  icon="save"
                  htmlType="submit"
                  size="large"
                  loading={loadingSubmit}
                >
                  LƯU
                </Button>
              </div>
            </Loading>
          </div>
        </Form>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  categories: PropTypes.objectOf(PropTypes.any),
  menuData: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  details: {},
  loading: {},
  dispatch: {},
  categories: {},
  menuData: [],
  error: {},
};

export default Index;
