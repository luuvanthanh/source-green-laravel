import { memo, useRef, useState, useEffect } from 'react';
import { Form, Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { Scrollbars } from 'react-custom-scrollbars';
import csx from 'classnames';
import { connect, history, withRouter } from 'umi';
import { head, isEmpty, get, omit } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import variables from '@/utils/variables';

const days = [
  { id: 'Monday', name: 'Thứ hai' },
  { id: 'Tuesday', name: 'Thứ ba' },
  { id: 'Wednesday', name: 'Thứ tư' },
  { id: 'Thursday', name: 'Thứ năm' },
  { id: 'Friday', name: 'Thứ sáu' },
  { id: 'Saturday', name: 'Thứ bảy' },
  { id: 'Sunday', name: 'Chủ nhật' },
];

const classes = [
  { id: 1, name: 'Lớp Preschool 1' },
  { id: 2, name: 'Lớp Preschool 2' },
];

const { List: FormList } = Form;

const mapStateToProps = ({ timeTablesAdd, loading }) => ({
  loading,
  branches: timeTablesAdd.branches,
  error: timeTablesAdd.error,
});
const Index = memo(({ dispatch, loading: { effects }, match: { params }, branches, error }) => {
  const [type, setType] = useState(1);
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const loadingSubmit = effects[`timeTablesAdd/ADD`] || effects[`timeTablesAdd/UPDATE`];
  const loading = effects[`timeTablesAdd/GET_DETAILS`] || effects[`timeTablesAdd/GET_BRANCHES`];

  const formRef = useRef();

  const onFinish = (values) => {
    const payload = {
      ...omit(values, 'date'),
      fromDate: values.date[0],
      toDate: values.date[1],
      timetableWeeks: values.timetableWeeks.map((item) => ({
        dayOfWeek: item,
      })),
    };
    dispatch({
      type: 'timeTablesAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
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

  useEffect(() => {
    dispatch({
      type: 'timeTablesAdd/GET_BRANCHES',
      payload: params,
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Helmet title="Tạo thời khóa biểu" />
        <Pane className="row" style={{ marginBottom: 20 }}>
          <Pane className="col">
            <Heading type="page-title">Tạo thời khóa biểu</Heading>
          </Pane>
        </Pane>
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={onFinish}
          initialValues={{
            type: 1,
            timetableDetails: [{}],
          }}
        >
          <Pane className="row">
            <Pane className="col-lg-6">
              <Pane className="card" style={{ padding: 20 }}>
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Tạo thời khóa biểu
                </Heading>

                <Pane className={csx('row', 'border-bottom', 'mb20')}>
                  <Pane className="col-lg-12">
                    <FormItem
                      label="Áp dụng cho thứ"
                      name="timetableWeeks"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT_MUTILPLE}
                      data={days}
                    />
                  </Pane>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Khoảng thời gian áp dụng"
                      name="date"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.RANGE_PICKER}
                    />
                  </Pane>
                </Pane>

                <Pane className={csx('row', 'border-bottom', 'mb20')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Cơ sở áp dụng"
                      name="branchId"
                      rules={[variables.RULES.EMPTY]}
                      type={variables.SELECT}
                      data={branches}
                    />
                  </Pane>
                </Pane>

                <Pane className={csx('row', 'border-bottom', 'mb20')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Loại áp dụng"
                      name="type"
                      type={variables.RADIO}
                      data={[
                        { value: 1, label: 'Nhóm lớp' },
                        { value: 2, label: 'Cá nhân trẻ' },
                      ]}
                      onClick={({ target: { value } }) => value && setType(value)}
                      radioInline
                    />
                  </Pane>
                </Pane>

                {/* check type radio để hiện */}
                {+type === 1 && (
                  <Pane className="row">
                    {classes.map(({ id, name }) => (
                      <Pane className="col-lg-12" key={id}>
                        <Checkbox>{name}</Checkbox>
                      </Pane>
                    ))}
                  </Pane>
                )}
                {+type === 2 && (
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <FormItem
                        label="Chọn trẻ"
                        name="student"
                        type={variables.SELECT}
                        data={[{ id: 1, name: 'Subeo' }]}
                      />
                    </Pane>
                  </Pane>
                )}
              </Pane>
            </Pane>

            <Pane className="col-lg-6">
              <Pane className="card">
                <Pane style={{ padding: '20px 20px 0 20px' }}>
                  <Heading type="form-title">Chi tiết</Heading>
                </Pane>

                <FormList name="timetableDetails">
                  {(times, { add, remove }) => (
                    <>
                      <Pane className="border-bottom">
                        <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
                          {times.map(({ key, name }, index) => (
                            <Pane
                              key={key}
                              className={csx('position-relative', {
                                'border-bottom': index < times.length - 1,
                              })}
                              style={{ padding: '20px 20px 0 20px' }}
                            >
                              <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                Mốc thời gian {index + 1}
                              </Heading>

                              {times.length > 1 && (
                                <DeleteOutlined
                                  className="position-absolute"
                                  style={{ top: 20, right: 20, zIndex: 2 }}
                                  onClick={() => remove(name)}
                                />
                              )}

                              <Pane className="row">
                                <Pane className="col-lg-6">
                                  <FormItem
                                    label="Giờ bắt đầu"
                                    name={[name, 'fromTime']}
                                    type={variables.TIME_PICKER}
                                    rules={[variables.RULES.EMPTY]}
                                  />
                                </Pane>
                                <Pane className="col-lg-6">
                                  <FormItem
                                    label="Giờ kết thúc"
                                    name={[name, 'toTime']}
                                    type={variables.TIME_PICKER}
                                    rules={[variables.RULES.EMPTY]}
                                  />
                                </Pane>

                                <Pane className="col-lg-12">
                                  <FormItem
                                    label="Nội dung"
                                    name={[name, 'content']}
                                    type={variables.INPUT}
                                  />
                                </Pane>
                              </Pane>
                            </Pane>
                          ))}
                        </Scrollbars>
                      </Pane>

                      <Pane style={{ padding: 20 }} className="border-bottom">
                        <Button
                          className="text-uppercase"
                          color="success"
                          ghost
                          icon="plus"
                          onClick={add}
                        >
                          Thêm mốc thời gian
                        </Button>
                      </Pane>
                    </>
                  )}
                </FormList>

                <Pane className="p20">
                  <Button
                    size="large"
                    color="success"
                    htmlType="submit"
                    style={{ marginLeft: 'auto' }}
                    loading={loadingSubmit}
                  >
                    Tạo
                  </Button>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Form>
      </Loading>
    </Pane>
  );
});

export default withRouter(connect(mapStateToProps)(Index));
