import React, { memo, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get, isEmpty } from 'lodash';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import { useDispatch, useSelector } from 'dva';

const Index = memo(() => {
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const history = useHistory();

  const [
    { error, details },
    { menuLeftTimeTable },
  ] = useSelector(({ timetableGroupActivitiesAdd, menu }) => [timetableGroupActivitiesAdd, menu]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'timetableGroupActivitiesAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && get(params, 'id')) {
      formRef.setFieldsValue({
        name: details?.name,
        timetableActivityDetails: details?.timetableActivityDetails.map((item) => ({
          id: item?.id,
          name: item?.name,
          isTeachJoining: item?.isTeachJoining,
        })),
      });
    }
  }, [details]);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'timetableGroupActivitiesAdd/UPDATE' : 'timetableGroupActivitiesAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        timetableActivityDetails: values.timetableActivityDetails.map((item) => ({
          id: item?.id || null,
          name: item?.name && item?.name,
          isTeachJoining: !!item?.isTeachJoining,
        })),
      },
      callback: (response) => {
        if (response) {
          history.goBack();
        }
      },
    });
  };

  return (
    <>
      <Breadcrumbs
        last={params.id ? 'Chỉnh sửa nhóm hoạt động' : 'Tạo nhóm hoạt động'}
        menu={menuLeftTimeTable}
      />
      <Form
        className={styles['layout-form']}
        layout="vertical"
        form={formRef}
        initialValues={{
          data: [{}],
        }}
        onFinish={onFinish}
      >
        <div className={styles['content-form']}>
          <Loading
            isError={error.isError}
            params={{ error, goBack: '/thoi-khoa-bieu/danh-muc/nhom-hoat-dong' }}
          >
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className={classnames(styles['content-children'], 'mt10')}>
                  <Text color="dark" size="large-medium">
                    Thông tin thêm mới
                  </Text>
                  <div className="row mt-3">
                    <div className="col-lg-7">
                      <FormItem
                        label="Tên nhóm hoạt động"
                        name="name"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.INPUT}
                      />
                    </div>
                    <div className="col-lg-5">
                      <FormItem
                        className="checkbox-row checkbox-small mt30"
                        label="Chỉ áp dụng cho 1 lớp"
                        type={variables.CHECKBOX_SINGLE}
                      />
                    </div>
                  </div>
                </div>

                <div className={classnames(styles['content-children'], 'mt10')}>
                  <Text color="dark" size="large-medium">
                    Chi tiết
                  </Text>
                  <div className="row mt-3">
                    <div className="col-lg-12">
                      <Form.List name="timetableActivityDetails">
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map((field, index) => (
                              <div key={index} className="row align-item-center mt10">
                                <div className="col-2">
                                  <Text size="small" className="mt5">
                                    Hoạt động {index + 1}
                                  </Text>
                                </div>
                                <div className="col-5">
                                  <FormItem
                                    name={[field.name, 'name']}
                                    rules={[variables.RULES.EMPTY]}
                                    type={variables.INPUT}
                                  />
                                </div>
                                <div className="col-4">
                                  <FormItem
                                    className="checkbox-row checkbox-small"
                                    label="Có giáo viên phụ trách"
                                    name={[field.name, 'isTeachJoining']}
                                    type={variables.CHECKBOX_FORM}
                                    valuePropName="checked"
                                  />
                                </div>
                                <div className="col-1">
                                  <div className="groups-input mt5">
                                    <span
                                      className="icon icon-remove"
                                      role="presentation"
                                      onClick={() => remove(field.name)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}

                            <Button color="success" icon="plus" onClick={() => add()}>
                              Thêm
                            </Button>
                          </>
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
                  >
                    HỦY
                  </Button>
                  <Button color="green" icon="save" htmlType="submit" size="large">
                    LƯU
                  </Button>
                </div>
              </div>
            </div>
          </Loading>
        </div>
      </Form>
    </>
  );
});

export default Index;
