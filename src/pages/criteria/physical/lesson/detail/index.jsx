import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'umi';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Loading from '@/components/CommonComponent/Loading';
import classnames from 'classnames';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const mounted = useRef(false);

  const {
    menuLeftCriteria,
    years,
    loading: { effects },
  } = useSelector(({ menu, loading, physicalLessonAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    years: physicalLessonAdd.years,
    error: physicalLessonAdd.error,
  }));

  const [details, setDetails] = useState(undefined);

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
    mounted.current = true;
    return mounted.current;
  }, []);
  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last={params.id ? details?.code : 'Tạo mới'} menu={menuLeftCriteria} />
      <Helmet title="Subject" />
      <Loading
        loading={effects['physicalLessonAdd/GET_DATA']}
      >
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form
              layout="vertical"
              form={form}
              initialValues={{
                data: [{}],
              }}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <div className="col-lg-3">
                    <FormDetail
                      name={details?.code} label="Mã ID"
                    />
                  </div>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={details?.schoolYear?.id}
                      label="Năm học"
                      data={years}
                      type="select"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={details?.name}
                      label="Chương trình học"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={details?.rateOfApplication}
                      label="Tỉ lệ áp dụng (%)"
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormDetail
                      name={[...new Map(details?.classes?.map(i => i?.class?.branch)?.map(item => [item.id, item])).values()]}
                      label="Cở sở áp dụng"
                      type="selectTags"
                    />
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormDetail
                      name={details?.classes?.map(i => i?.class)}
                      label="Lớp áp dụng"
                      type="selectTags"
                    />
                  </Pane>
                </Pane>
              </Pane>
            </Form>
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
                </div>
                {details?.sessions?.map((fieldItem, indexItem) => (
                  <>
                    <Pane key={indexItem} className="d-flex">
                      <div className={stylesModule['card-item']}>
                        <div className={classnames(stylesModule.cols)}>
                          <FormDetail name={fieldItem?.weekIndex} type="table" />
                        </div>
                        <div className={classnames(stylesModule.col)}>
                          <FormDetail name={fieldItem?.name} type="table" />
                        </div>
                        <div className={classnames(stylesModule.col)}>
                          <FormDetail name={fieldItem?.content} type="table" />
                        </div>
                        <div className={classnames(stylesModule.col)}>
                          <FormDetail name={fieldItem?.target} type="table" />
                        </div>
                      </div>
                    </Pane>
                  </>))}
              </div>
            </Pane>
          </Pane>
          <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
            <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
              Đóng
            </p>
            <Button
              className="ml-auto px25"
              color="success"
              size="large"
              onClick={() => {
                history.push(`/chuong-trinh-hoc/the-chat/bai-hoc/${details?.id}/edit`);
              }}>
              Sửa
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </div >
  );
});

export default Index;
