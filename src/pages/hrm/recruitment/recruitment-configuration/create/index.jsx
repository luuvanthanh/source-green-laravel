import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import { variables } from '@/utils';
import { useParams, history, useLocation } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

import FormItem from '@/components/CommonComponent/FormItem';
import TableInput from '../component/table-input';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const { query } = useLocation();

  const {
    loading: { effects },
    dataLevel,
    divisions,
    dataPerview,
    menuLeftHRM,
  } = useSelector(({ menu, loading, hrmRecruitmentRecruitmentConfigurationAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    divisions: hrmRecruitmentRecruitmentConfigurationAdd.divisions,
    dataLevel: hrmRecruitmentRecruitmentConfigurationAdd.dataLevel,
    dataPerview: hrmRecruitmentRecruitmentConfigurationAdd.dataPerview,
    error: hrmRecruitmentRecruitmentConfigurationAdd.error,
  }));

  const [dataTable, setDataTable] = useState([]);
  const loadingSubmit =
    effects[`hrmRecruitmentRecruitmentConfigurationAdd/UPDATE`] ||
    effects[`hrmRecruitmentRecruitmentConfigurationAdd/ADD`];

  const onFinish = (values) => {
    dispatch({
      type: params.id
        ? 'hrmRecruitmentRecruitmentConfigurationAdd/UPDATE'
        : 'hrmRecruitmentRecruitmentConfigurationAdd/ADD',
      payload: {
        id: params.id,
        ...values,
        data: dataTable?.map((i) => ({ name: i?.name })),
      },
      callback: (response, error) => {
        if (response) {
          history.push('/quan-ly-nhan-su/tuyen-dung/cau-hinh-tuyen-dung');
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

  useEffect(() => {
    dispatch({
      type: 'hrmRecruitmentRecruitmentConfigurationAdd/GET_RECRUIMENT_LEVELS',
      payload: {},
    });
    dispatch({
      type: 'hrmRecruitmentRecruitmentConfigurationAdd/GET_DIVISIONS',
      payload: {},
    });
    if (query?.type === 'detail' || query?.type === 'perviewDetails' || query?.type === 'new') {
      form.setFieldsValue({
        ...dataPerview,
      });
      setDataTable(dataPerview?.question);
    }
  }, []);

  useEffect(() => {
    if (params.id && query?.type !== 'perviewDetails' && query?.type === 'detail') {
      dispatch({
        type: 'hrmRecruitmentRecruitmentConfigurationAdd/GET_DATA',
        payload: params,
        callback: (response) => {
          if (response) {
            form.setFieldsValue({
              ...response,
            });
            setDataTable(response?.question);
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onSendPerview = () => {
    form.validateFields().then((values) => {
      const id = uuidv4();
      dispatch({
        type: 'hrmRecruitmentRecruitmentConfigurationAdd/GET_SET_DATA_PERVIEW',
        payload: { ...values, id, question: dataTable },
      });
      if (params?.id) {
        history.push(
          `/quan-ly-nhan-su/tuyen-dung/cau-hinh-tuyen-dung/${params?.id}/chi-tiet?type=perviewDetails`,
        );
      } else {
        history.push(`/quan-ly-nhan-su/tuyen-dung/cau-hinh-tuyen-dung/${id}/chi-tiet?type=perview`);
      }
    });
  };

  return (
    <>
      <Helmet title="Cấu hình tuyển dụng" />
      <Breadcrumbs last={params.id ? 'Sửa' : 'Tạo mới'} menu={menuLeftHRM} />
      <div>
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" onFinish={onFinish} form={form} initialValues={{}}>
              <Loading
                params={{ type: 'container' }}
                loading={effects['hrmRecruitmentRecruitmentConfigurationAdd/GET_DATA']}
              >
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Thông tin chung
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-3">
                      <FormItem
                        name="code"
                        placeholder=" "
                        type={variables.INPUT}
                        label="ID"
                        disabled
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="name"
                        placeholder="Nhập"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Tên cấu hình"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="divisionId"
                        placeholder="Chọn"
                        data={divisions}
                        type={variables.SELECT}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Bộ phận"
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        name="recruitmentLevelId"
                        placeholder="Chọn"
                        type={variables.SELECT}
                        data={dataLevel}
                        rules={[variables.RULES.EMPTY_INPUT]}
                        label="Level"
                      />
                    </Pane>
                    <Pane className="col-lg-12">
                      <FormItem
                        name="note"
                        placeholder="Chọn"
                        type={variables.INPUT}
                        label="Ghi chú"
                      />
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="card p20">
                  <Heading type="form-title" className="mb15">
                    Câu hỏi tuyển dụng
                  </Heading>
                  <TableInput setDataTable={setDataTable} dataTable={dataTable} />
                </Pane>
                <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                  <p
                    className="btn-delete"
                    role="presentation"
                    onClick={() => history.push('/quan-ly-nhan-su/tuyen-dung/cau-hinh-tuyen-dung')}
                  >
                    Hủy
                  </p>
                  <div className="d-flex">
                    <Button
                      className="ml-auto px25"
                      color="primary"
                      size="large"
                      onClick={() => onSendPerview()}
                      permission={
                        params?.id
                          ? `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHTUYENDUNG}${ACTION.EDIT}`
                          : `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHTUYENDUNG}${ACTION.CREATE}`
                      }
                    >
                      Xem trước
                    </Button>
                    <Button
                      className="ml-auto px25 ml10"
                      color="success"
                      htmlType="submit"
                      size="large"
                      loading={loadingSubmit}
                      permission={
                        params?.id
                          ? `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHTUYENDUNG}${ACTION.EDIT}`
                          : `${FLATFORM.WEB}${permissions.HRM_TUYENDUNG_CAUHINHTUYENDUNG}${ACTION.CREATE}`
                      }
                    >
                      Lưu
                    </Button>
                  </div>
                </Pane>
              </Loading>
            </Form>
          </Pane>
        </Pane>
      </div>
    </>
  );
});

export default Index;
