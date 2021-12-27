import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import classNames from 'classnames';
import { history, useParams } from 'umi';
import { head, isEmpty, omit } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import variables from '@/utils/variables';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
import variablesModules from '../../utils/variables';

const Index = memo(() => {
  const { List: FormList } = Form;
  const mounted = useRef(false);
  const dispatch = useDispatch();
  const [
    { branches, classes, error },
    { menuLeftTimeTable },
    loading,
  ] = useSelector(({ timeTablesChildrenAdd, menu, loading }) => [
    timeTablesChildrenAdd,
    menu,
    loading,
  ]);
  const params = useParams();

  const loadingSubmit =
    loading[`timeTablesChildrenAdd/ADD`] || loading[`timeTablesChildrenAdd/UPDATE`];
  const loadingForm =
    loading[`timeTablesChildrenAdd/GET_DETAILS`] || loading[`timeTablesChildrenAdd/GET_BRANCHES`];

  const formRef = useRef();
  const [disabled, setDisabled] = useState(true);
  const [fileImage, setFileImage] = useState([null]);

  const onFinish = (values) => {
    const payload = {
      ...params,
      ...omit(values, 'date'),
      fromDate: values.date[0],
      toDate: values.date[1],
      timetableWeeks: values?.timetableWeeks?.map((item) => ({
        dayOfWeek: item,
      })),
      classTimetables: values?.classTimetables?.map((item) => ({
        classId: item,
      })),
      timetableDetails: values?.timetableDetails?.map((item) => ({
        content: item.content,
        fromTime: item.fromTime,
        toTime: item.toTime,
      })),
    };
    dispatch({
      type: params.id ? 'timeTablesChildrenAdd/UPDATE' : 'timeTablesChildrenAdd/ADD',
      payload,
      callback: (response, err) => {
        if (response) {
          history.goBack();
        }
        if (err) {
          if (err?.validationErrors && !isEmpty(err?.validationErrors)) {
            err?.validationErrors.forEach((item) => {
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

  useEffect(() => {
    dispatch({
      type: 'timeTablesChildrenAdd/GET_BRANCHES',
      payload: params,
    });
  }, []);

  const onChangeBranch = (branch) => {
    dispatch({
      type: 'timeTablesChildrenAdd/GET_CLASSES',
      payload: {
        branch,
      },
    });
  };

  const handleChangeRadioClass = (e) => {
    if (e.target.checked) setDisabled(false);
    if (e.target.checked && e.target.value === 'all') {
      if (classes) {
        formRef.current.setFieldsValue({
          classTimetables: classes.map((item) => item?.id),
        });
      }
    }
    if (e.target.checked && e.target.value === 'option') {
      if (classes) {
        formRef.current.setFieldsValue({
          classTimetables: [],
        });
      }
    }
  };

  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  const onSetImage = (file, position) => {
    mountedSet(
      setFileImage,
      fileImage.map((item, index) => (index === position ? file : item)),
    );
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'timeTablesChildrenAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          onChangeBranch(response.branchId);
          formRef.current.setFieldsValue({
            date: [moment(response.fromDate), moment(response.fromDate)],
            timetableWeeks: response.timetableWeeks.map((item) => item.dayOfWeek),
            branchId: response.branchId,
            timetableDetails: response.timetableDetails.map((item) => ({
              ...item,
              fromTime: moment(item.fromTime),
              toTime: moment(item.toTime),
            })),
            classTimetables: response.classTimetables.map((item) => item?.class?.id),
            allClass: response.isAllClass ? 'all' : 'option',
          });
          setDisabled(false);
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Breadcrumbs
        last={params.id ? 'Chỉnh sửa thời khóa biểu' : 'Tạo thời khóa biểu'}
        menu={menuLeftTimeTable}
      />
      <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={onFinish}
          initialValues={{
            timetableDetails: [{}],
          }}
        >
          <Loading loading={loadingForm} isError={error.isError} params={{ error }}>
            <Pane className="row">
              <Pane className="col-lg-6">
                <Pane className="card" style={{ padding: 20 }}>
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    {params.id ? 'Chỉnh sửa thời khóa biểu' : 'Tạo thời khóa biểu'}
                  </Heading>

                  <Pane className={classNames('row', 'border-bottom', 'mb20')}>
                    <Pane className="col-lg-12">
                      <FormItem
                        label="Áp dụng cho thứ"
                        name="timetableWeeks"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT_MUTILPLE}
                        data={variablesModules.DAYS}
                      />
                    </Pane>
                    <Pane className="col-lg-8">
                      <FormItem
                        label="Khoảng thời gian áp dụng"
                        name="date"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.RANGE_PICKER}
                      />
                    </Pane>
                  </Pane>

                  <Pane className={classNames('row', 'border-bottom', 'mb20')}>
                    <Pane className="col-lg-8">
                      <FormItem
                        label="Cơ sở áp dụng"
                        name="branchId"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.SELECT}
                        data={branches}
                        onChange={onChangeBranch}
                      />
                    </Pane>
                  </Pane>

                  {!isEmpty(classes) && (
                    <Pane className="row">
                      <Pane className={classNames('col-lg-12', 'border-bottom', 'mb20')}>
                        <FormItem
                          label="Loại lớp áp dụng"
                          name="allClass"
                          type={variables.RADIO}
                          rules={[variables.RULES.EMPTY]}
                          className="radio-group group-column"
                          data={variablesModules.RADIO_CHILDREN}
                          onChange={(e) => handleChangeRadioClass(e)}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          name="classTimetables"
                          type={variables.CHECKBOX}
                          rules={[variables.RULES.EMPTY]}
                          className="checkbox-group group-column"
                          data={classes.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                          disabled={disabled}
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
                                className={classNames('position-relative', {
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
                                    <Form.Item name={[key, 'fileImage']} label="Hình ảnh">
                                      <ImageUpload
                                        callback={(res) => {
                                          onSetImage(res.fileInfo.url, index);
                                        }}
                                        fileImage={fileImage[index]}
                                      />
                                    </Form.Item>
                                  </Pane>
                                </Pane>
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
                                      rules={[variables.RULES.EMPTY]}
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
                            onClick={() => add()}
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
                      Lưu
                    </Button>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Loading>
        </Form>
      </Pane>
    </>
  );
});

export default Index;
