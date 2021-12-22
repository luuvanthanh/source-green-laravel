import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { head, isEmpty, get, omit } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Table from '@/components/CommonComponent/Table';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import HelperModules from '../utils/Helper';
import stylesModule from '../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };
const General = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [{ menuLeftAllocation }, {
    details,
  }, effects] = useSelector(({ menu, allocationRegisterAdd, loading: { effects } }) => [menu, allocationRegisterAdd, effects]);
  const mounted = useRef(false);
  const loadingSubmit = effects['allocationRegisterAdd/ADD'] || effects['allocationRegisterAdd/UPDATE'];


  const params = useParams();

  const history = useHistory();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const [data, setData] = useState([{
    index: 1,
    name: "Bé Zia",
    time: '16:30 - 19:00',
    fileImage: "[\"/file-storage/2021/12/20211220/3a00e85b-1d9b-8a8e-6864-c5f23fb2d0e7.JPG\"]",
  }]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'allocationRegisterAdd/GET_DETAILS',
        payload: params,
        callback: (response) => {
          if (response) {
            setData(
              response?.symptoms.map((item, index) => ({
                ...item,
                index,
              })),
            );
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        ...details,
        ...head(details.positionLevel) || {},
      });
    }
  }, [details]);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'allocationRegisterAdd/UPDATE' : 'allocationRegisterAdd/ADD',
      payload: {
        ...details,
        ...params,
        name: values?.name,
        symptoms: data.map((item) => ({
          ...omit(item, 'index')
        }))
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.setFields([
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


  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'index',
        lassName: 'min-width-100',
        render: (record) => <Text size="normal">{record?.index}</Text>,
      },
      {
        title: 'Học sinh',
        key: 'name',
        lassName: 'min-width-100',
        render: (record) => (
          <>
            <AvatarTable
              fileImage={Helper.getPathAvatarJson(record.fileImage)}
            /> {record?.name}
          </>)
      },
      {
        title: 'Giờ đăng ký',
        key: 'time',
        lassName: 'min-width-100',
        render: (record) => <Text size="normal">{record?.time}</Text>,
      },
    ];
    return columns;
  };

  return (
    <>
      <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftAllocation} />
      <Pane className="p20 col-lg-8 offset-lg-2">
        <Form
          layout="vertical"
          form={form}
          initialValues={{}}
          onFinish={onFinish}
        >
          <Pane>
            <Pane className="card">
              <Pane className="p20">
                <Heading type="form-title" className="mb20">
                  Thông tin chung
                </Heading>

                <div className="row border-bottom" {...marginProps}>
                  <div className="col-lg-4">
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required">Ngày đăng ký</label>
                    </div>
                    <Text size="normal" className={stylesModule['general-detail']}>
                      {Helper.getDate(details.date, variables.DATE_FORMAT.DATE)}
                    </Text>
                  </div>
                  <div className="col-lg-4">
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required">Loại lớp</label>
                    </div>
                    <Text size="normal" className={stylesModule['general-detail']}>
                      {details?.classTypes}
                    </Text>
                  </div>
                  <div className="col-lg-4">
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required">Lớp</label>
                    </div>
                    <Text size="normal" className={stylesModule['general-detail']}>
                      {details?.class}
                    </Text>
                  </div>
                </div>

                <div className="row ">
                  <div className="col-lg-4">
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required">Trạng thái</label>
                    </div>
                    <div className="row ">
                      <div className="col-lg-6">
                        <Text size="normal" className={stylesModule['general-detail']}>
                          {HelperModules.tagStatus(details?.handleStatus)}
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required">Loại lớp</label>
                    </div>
                    <FormItem name="name" type={variables.SELECT} rules={[variables.RULES.EMPTY_INPUT]} />
                  </div>
                </div>
              </Pane>
            </Pane>

            <Pane className="card">
              <Pane className="p20">
                <Heading type="form-title" className="mb20">
                  Danh sách học sinh đăng ký
                </Heading>

                <div  {...marginProps}>
                  <Table
                    columns={header()}
                    dataSource={data}
                    pagination={false}
                    isEmpty
                    params={{
                      header: header(),
                      type: 'table',
                    }}
                    bordered={false}
                    rowKey={(record) => record.index}
                    scroll={{ x: '100%' }}
                  />
                </div>
              </Pane>
            </Pane>
            <Pane className="pb20 d-flex justify-content-between align-items-center">
              <p
                className="btn-delete"
                role="presentation"
                loading={loadingSubmit}
                onClick={() => history.goBack()}
              >
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
        </Form>
      </Pane>
    </>
  );
},
);

General.propTypes = {
};

General.defaultProps = {
};

export default General;
