import FormItem from '@/components/CommonComponent/FormItem';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { Form } from 'antd';
import { memo, useEffect, useRef, useState } from 'react';
import Loading from '@/components/CommonComponent/Loading';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'umi';
import Button from '@/components/CommonComponent/Button';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import { get, head, isEmpty } from 'lodash';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const mounted = useRef(false);
  const {
    branches,
    years,
    menuLeftCriteria,
    loading: { effects },
    user,
    defaultBranch
  } = useSelector(({ menu, loading, physicalLessonAdd, user }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    branches: physicalLessonAdd?.branches,
    years: physicalLessonAdd.years,
    error: physicalLessonAdd.error,
    user: user.user,
    defaultBranch: user.defaultBranch,
  }));

  const loadingSubmit = effects['physicalLessonAdd/ADD'] || effects['physicalLessonAdd/UPDATE'];
  const [dataClass, setDataClass] = useState([]);
  const [details, setDetails] = useState(undefined);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'physicalLessonAdd/UPDATE' : 'physicalLessonAdd/ADD',
      payload: {
        name: values?.name,
        schoolYearId: values?.schoolYearId,
        rateOfApplication: values?.rateOfApplication,
        sessions: values?.sessions,
        classIds: values?.classIds,
        id: params.id
      },
      callback: (response, error) => {
        if (response) {
          if (response) {
            history.push(`/chuong-trinh-hoc/the-chat/bai-hoc`);
          }
        }
        if (error) {
          if (!isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              form.setFields([
                {
                  name: get(item, 'member').toLowerCase(),
                  errors: [get(item, 'message')],
                },
              ]);
            });
          }
        }
      },
    });
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      if (details?.id) {
        form.setFieldsValue({
          branchIds: Array.from(new Set(details?.classes?.map((i) => i?.class?.branch?.id))),
          classIds: details?.classes?.map((i) => i?.class?.id),
          code: details?.code,
          schoolYearId: details?.schoolYear?.id,
          name: details?.name,
          rateOfApplication: details?.rateOfApplication,
          sessions: details?.sessions
        });
      }
    }
    dispatch({
      type: 'physicalLessonAdd/GET_CLASSES',
      payload: { branchIds: Array.from(new Set(details?.classes?.map((i) => i?.class?.branch?.id))) },
      callback: (response) => {
        if (response) {
          setDataClass(response);
        }
      },
    });
  }, [details]);


  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'physicalLessonAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            setDetails(response);
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    dispatch({
      type: 'physicalLessonAdd/GET_BRANCHES',
      payload: {},
    });
    dispatch({
      type: 'physicalLessonAdd/GET_YEARS',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (defaultBranch?.id) {
      dispatch({
        type: 'physicalLessonAdd/GET_CLASSES',
        payload: { branchIds: defaultBranch?.id },
        callback: (response) => {
          if (response) {
            setDataClass(response);
          }
        },
      });
    }
  }, [defaultBranch]);

  const onChangeBranch = (e) => {
    dispatch({
      type: 'physicalLessonAdd/GET_CLASSES',
      payload: { branchIds: e },
      callback: (response) => {
        if (response) {
          setDataClass(response);
        }
      },
    });
    form.setFieldsValue({
      classId: undefined,
    });
  };

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? details?.code : 'Tạo mới'} menu={menuLeftCriteria} />
      <Helmet title="Bài học" />
      <Loading
        loading={effects[`physicalLessonAdd/GET_DATA`]}
      >
        <Pane className="pl20 pr20 pb20">
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              data: [{}],
            }}
            onFinish={onFinish}
          >
            <Pane>
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <div className="col-lg-3">
                    <FormItem
                      name="code"
                      type={variables.INPUT}
                      label="Mã ID"
                      allowClear={false}
                      disabled
                    />
                  </div>
                  <Pane className="col-lg-3">
                    <FormItem
                      name="schoolYearId"
                      placeholder="Chọn năm học"
                      data={years?.filter(i => i?.id === user?.schoolYear?.id)}
                      type={variables.SELECT}
                      label="Năm học"
                      rules={[variables.RULES.EMPTY_INPUT]}
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormItem
                      name="name"
                      placeholder="Chương trình học"
                      type={variables.INPUT}
                      label="Chương trình học"
                      rules={[variables.RULES.EMPTY_INPUT]}
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormItem
                      name="rateOfApplication"
                      placeholder="Tỉ lệ áp dụng"
                      label="Tỉ lệ áp dụng (%)"
                      type={variables.INPUT_COUNT}
                      rules={[variables.RULES.NUMBER]}
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="branchIds"
                      data={defaultBranch?.id ? [defaultBranch] : branches}
                      placeholder="Chọn cơ sở"
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY]}
                      label="Cở sở áp dụng"
                      onChange={onChangeBranch}
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name="classIds"
                      data={user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? dataClass?.filter(i => i?.classId === head(user?.objectInfo?.classTeachers)?.classId) : dataClass}
                      placeholder="Chọn lớp có trong cơ sở"
                      type={variables.SELECT_MUTILPLE}
                      rules={[variables.RULES.EMPTY]}
                      label="Lớp áp dụng"
                    />
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
            <Pane className="card p20">
              <Heading type="form-title" className="mb20">
                Chi tiết
              </Heading>
              <Pane className="col-lg-12 p-0">
                <div className={stylesModule['wrapper-table']}>
                  <div className={stylesModule['card-heading']}>
                    <div className={stylesModule.cols}>
                      <p className={stylesModule.norm}>Tuần</p>
                    </div>
                    <div className={stylesModule.col}>
                      <p className={stylesModule.norm}>Tên bài học</p>
                    </div>
                    <div className={stylesModule.col}>
                      <p className={stylesModule.norm}>Nội dung</p>
                    </div>
                    <div className={stylesModule.col}>
                      <p className={stylesModule.norm}>Mục tiêu</p>
                    </div>
                    <div className={stylesModule.cols}>
                      <p className={stylesModule.norm} />
                    </div>
                  </div>
                  <Form.List label="Hình thức tiếp cận" name={['sessions']} fieldKey={['sessions']}>
                    {(fieldsDetail, { remove, add }) => (
                      <>
                        {fieldsDetail.map((fieldItem, indexItem) => (
                          <>
                            <Pane key={indexItem} className="d-flex">
                              <div className={stylesModule['card-item']}>
                                <div className={classnames(stylesModule.cols)}>
                                  <FormItem
                                    className={stylesModule.item}
                                    fieldKey={[fieldItem.fieldKey, 'weekIndex']}
                                    name={[fieldItem.name, 'weekIndex']}
                                    placeholder="Nhập"
                                    type={variables.INPUT_COUNT}
                                    rules={[variables.RULES.NUMBER]}
                                  />
                                </div>
                                <div className={classnames(stylesModule.col)}>
                                  <FormItem
                                    className={stylesModule.item}
                                    fieldKey={[fieldItem.fieldKey, 'name']}
                                    name={[fieldItem.name, 'name']}
                                    placeholder="Nhập"
                                    type={variables.INPUT}
                                    rules={[variables.RULES.EMPTY_INPUT]}
                                  />
                                </div>
                                <div className={classnames(stylesModule.col)}>
                                  <FormItem
                                    className={stylesModule.item}
                                    fieldKey={[fieldItem.fieldKey, 'content']}
                                    name={[fieldItem.name, 'content']}
                                    placeholder="Nhập"
                                    type={variables.INPUT}
                                  />
                                </div>
                                <div className={classnames(stylesModule.col)}>
                                  <FormItem
                                    className={stylesModule.item}
                                    fieldKey={[fieldItem.fieldKey, 'target']}
                                    name={[fieldItem.name, 'target']}
                                    placeholder="Nhập"
                                    type={variables.INPUT}
                                  />
                                </div>
                                <div className={classnames(stylesModule.cols)}>
                                  {fieldsDetail.length > 1 && (
                                    <div className={styles['list-button']}>
                                      <button
                                        className={styles['button-circle']}
                                        onClick={() => {
                                          remove(indexItem);
                                        }}
                                        type="button"
                                      >
                                        <span className="icon-remove" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Pane>
                          </>
                        ))}
                        <Pane className="mt10 ml10 mb10 d-flex align-items-center color-success pointer ">
                          <span
                            onClick={() => add()}
                            role="presentation"
                            className={stylesModule.add}
                          >
                            <span className="icon-plus-circle mr5" />
                            Thêm
                          </span>
                        </Pane>
                      </>
                    )}
                  </Form.List>
                </div>
                <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loadingSubmit}
                  >
                    Lưu
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Form>
        </Pane>
      </Loading>
    </div>
  );
});

export default Index;
