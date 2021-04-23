import { memo, useRef, useEffect } from 'react';
import { Form, List } from 'antd';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { useSelector, useDispatch } from 'dva';
import { history, useParams, useLocation } from 'umi';

import csx from 'classnames';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import FormItem from '@/components/CommonComponent/FormItem';
import Button from '@/components/CommonComponent/Button';
import { Scrollbars } from 'react-custom-scrollbars';

import variables from '@/utils/variables';
import variablesModules from '..//utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import { isEmpty, head, get, toString } from 'lodash';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const { Item: ListItem } = List;

const Index = memo(({}) => {
  const formRef = useRef();
  const {
    loading: { effects },
    error,
    details,
    menuData,
    criteriaGroupProperties,
  } = useSelector(({ loading, user, healthUpdate, menu }) => ({
    user: user.user,
    loading,
    details: healthUpdate.details,
    criteriaGroupProperties: healthUpdate.criteriaGroupProperties,
    error: healthUpdate.error,
    menuData: menu.menuLeftHealth,
  }));
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const loading = effects[`healthUpdate/GET_DETAILS`];
  const loadingSubmit = effects[`healthUpdate/UPDATE`];
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'healthUpdate/GET_DETAILS',
        payload: {
          ...params,
          ...location.query,
        },
        callback: (response) => {
          if (response && !isEmpty(response)) {
            formRef.current.setFieldsValue({
              data: response.studentCriterias.map((item) => ({
                ...item,
                criteriaGroupPropertyId: item.criteriaGroupProperty.id,
                studentId: item.student.id,
                value: item.value,
                note: item.note,
              })),
            });
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'healthUpdate/GET_CRITERIA_GROUP_PROPERTIES',
        payload: {},
        callback: () => {},
      });
    }
  }, [params.id]);

  const onFinish = (values) => {
    dispatch({
      type: 'healthUpdate/UPDATE',
      payload: values.data.map((item) => ({
        id: item.id,
        studentCriteriaRequest: {
          reportDate: moment(),
          criteriaGroupPropertyId: item.criteriaGroupPropertyId,
          studentId: item.studentId,
          value: toString(item.value),
          note: item.note,
        },
      })),
      callback: (response) => {
        if (response) {
          history.push(`/suc-khoe/hom-nay`);
        }
      },
    });
  };

  return (
    <Form layout="vertical" colon={false} ref={formRef} onFinish={onFinish}>
      <Breadcrumbs last="Chỉnh sửa sức khỏe" menu={menuData} />
      <Pane style={{ padding: '0 20px' }}>
        <Helmet title="Chi tiết" />
        <Loading loading={loading} isError={error.isError} params={{ error, type: 'container' }}>
          <Pane className="row">
            <Pane className="col-lg-5">
              <Pane className="card">
                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <Heading type="form-title">
                    Sức khỏe hôm nay - Ngày{' '}
                    {moment(get(head(details.studentCriterias), 'creationTime')).format(
                      variables.DATE_FORMAT.DATE_VI,
                    )}
                  </Heading>
                </Pane>

                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <label className={styles.infoLabel}>Phụ huynh</label>
                  <Pane className={styles.userInformation}>
                    <AvatarTable fileImage={details?.parent?.fileImage} />
                    <Pane>
                      <h3>{details?.parent?.fullName || 'Nguyễn Anh'}</h3>
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <label className={styles.infoLabel}>Trẻ</label>
                  <Pane className={styles.userInformation}>
                    <AvatarTable
                      fileImage={
                        Helper.isJSON(get(head(details.studentCriterias), 'student.fileImage')) &&
                        head(JSON.parse(get(head(details.studentCriterias), 'student.fileImage')))
                      }
                    />
                    <Pane>
                      <h3>{get(head(details.studentCriterias), 'student.fullName') || 'Subeo'}</h3>
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="border-bottom" style={{ padding: 20 }}>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <label className={styles.infoLabel}>Cơ sở</label>
                      <Pane className="d-flex align-items-center">
                        <span className={styles.circleIcon}>
                          <span className={'icon-school'} />
                        </span>
                        <span className={styles.infoText}>
                          {get(head(details.studentCriterias), 'student.class.branch.name')}
                        </span>
                      </Pane>
                    </Pane>

                    <Pane className="col-lg-6">
                      <label className={styles.infoLabel}>Lớp</label>
                      <Pane className="d-flex align-items-center">
                        <span className={styles.circleIcon}>
                          <span className={'icon-open-book'} />
                        </span>
                        <span className={styles.infoText}>
                          {get(head(details.studentCriterias), 'student.class.name')}
                        </span>
                      </Pane>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="card">
                <List
                  dataSource={details?.changeLogs || []}
                  renderItem={(item) => (
                    <ListItem key={item.id} className={csx(styles.listItem, 'flex-column')}>
                      {item.studentCritetiaEntityChanges.map((itemChange, indexChange) => (
                        <Pane
                          style={{ padding: 20, width: '100%' }}
                          className="row"
                          key={indexChange}
                        >
                          <Pane className="col-md-5">
                            <Heading type="form-sub-title" style={{ marginBottom: 10 }}>
                              {Helper.getDate(
                                itemChange.changeTime,
                                variables.DATE_FORMAT.DATE_TIME,
                              )}
                            </Heading>
                          </Pane>
                          <Pane className="col-md-7">
                            <Pane>
                              {item.editor.userName}{' '}
                              {variablesModules?.HEALTH_ACTION_TYPE[`${item.httpMethod}`]}{' '}
                              {itemChange.criteriaGroupPropertypeName}
                            </Pane>
                          </Pane>
                        </Pane>
                      ))}
                    </ListItem>
                  )}
                />
              </Pane>
            </Pane>

            <Pane className="col-lg-7">
              <Pane className="card">
                <Pane className="border-bottom p20">
                  <Heading type="form-title">Chi tiết</Heading>
                </Pane>

                <Form.List name="data">
                  {(fields, { add, remove }) => (
                    <>
                      <Scrollbars autoHeight autoHeightMax={window.innerHeight - 300}>
                        {fields.map(({ key, name, criteriaGroupProperty }, index) => {
                          const item = details.studentCriterias.find(
                            (itemCriteria, indexCriteria) => indexCriteria === index,
                          );
                          const criteria = criteriaGroupProperties.find(
                            (itemCriteria) => itemCriteria.id === item?.criteriaGroupProperty?.id,
                          );
                          if (!criteria) {
                            return null;
                          }
                          return (
                            <Pane
                              key={key}
                              className={csx('pb-0', 'border-bottom', 'position-relative')}
                              style={{ padding: 20 }}
                            >
                              <Heading type="form-block-title" className="mb10">
                                {criteria.property}
                              </Heading>
                              {criteria.criteriaDataType.type === 'radioButton' && (
                                <Pane className="row">
                                  <Pane className="col-lg-12">
                                    <FormItem
                                      name={[key, 'value']}
                                      label={criteria.property}
                                      data={
                                        Helper.isJSON(criteria.criteriaDataType.value)
                                          ? JSON.parse(criteria.criteriaDataType.value).map(
                                              (item) => ({
                                                value: item,
                                                label: item,
                                              }),
                                            )
                                          : []
                                      }
                                      type={variables.RADIO}
                                      rules={[variables.RULES.EMPTY]}
                                      radioInline
                                    />
                                  </Pane>
                                </Pane>
                              )}
                              {criteria.criteriaDataType.type === 'number' && (
                                <Pane className="row">
                                  <Pane className="col-lg-12">
                                    <FormItem
                                      name={[key, 'value']}
                                      label={criteria.property}
                                      type={variables.INPUT_COUNT}
                                      rules={[variables.RULES.EMPTY]}
                                    />
                                  </Pane>
                                </Pane>
                              )}
                              {criteria.criteriaDataType.type === 'textbox' && (
                                <Pane className="row">
                                  <Pane className="col-lg-12">
                                    <FormItem
                                      name={[key, 'value']}
                                      label={criteria.property}
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY]}
                                    />
                                  </Pane>
                                </Pane>
                              )}
                              {criteria.criteriaDataType.isHasNote && (
                                <Pane className="row">
                                  <Pane className="col-lg-12">
                                    <FormItem
                                      name={[key, 'note']}
                                      label="Ghi chú"
                                      type={variables.INPUT}
                                    />
                                  </Pane>
                                </Pane>
                              )}
                            </Pane>
                          );
                        })}
                      </Scrollbars>
                    </>
                  )}
                </Form.List>

                <Pane className="p20">
                  <Button
                    className="ml-auto"
                    size="large"
                    htmlType="submit"
                    color="success"
                    loading={loadingSubmit}
                  >
                    Cập nhật
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

export default Index;
