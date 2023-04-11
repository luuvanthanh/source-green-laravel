import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history, useLocation } from 'umi';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { variables } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormDetail from '@/components/CommonComponent/FormDetail';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const { query } = useLocation();
  const mounted = useRef(false);
  const {
    loading: { effects },
    dataPerview,
    menuLeftHRM,
  } = useSelector(({ menu, loading, hrmRecruitmentRecruitmentConfigurationAdd }) => ({
    loading,
    menuLeftHRM: menu.menuLeftHRM,
    dataPerview: hrmRecruitmentRecruitmentConfigurationAdd.dataPerview,
    error: hrmRecruitmentRecruitmentConfigurationAdd.error,
  }));

  const loadingContainer = effects[`hrmRecruitmentRecruitmentConfigurationAdd/GET_DATA`];

  useEffect(() => {
    if (params.id && query?.type !== 'perview' && query?.type !== 'perviewDetails') {
      dispatch({
        type: 'hrmRecruitmentRecruitmentConfigurationAdd/GET_DATA',
        payload: params,
        callback: () => {},
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Breadcrumbs last={query?.type === 'perview' ? 'Xem trước' : 'Chi tiết'} menu={menuLeftHRM} />
      <div className="col-lg-8 offset-lg-2">
        <Helmet title="Loại tài sản" />
        <Pane className="pl20 pr20 pb20">
          <Pane>
            <Form layout="vertical" form={form} initialValues={{}}>
              <Loading params={{ type: 'container' }} loading={loadingContainer}>
                <Pane className="p20">
                  <Pane className={stylesModule['wrapper-card']}>
                    <div className={stylesModule['wrapper-header']}>
                      <div className={stylesModule['item-logo']}>
                        <div className={stylesModule.logo}>
                          <img src="/images/webForm.png" alt="ImageUpload" />
                        </div>
                        <div className="d-flex">
                          <div className={stylesModule['wrapper-item']}>
                            <div className={stylesModule.icon}>
                              <img src="/images/hrm/smartphone.svg" alt="ImageUpload" />
                              <p className={stylesModule.text}>Tổng đài</p>
                            </div>
                            <h4 className={stylesModule.textNumber}> 1800 6663</h4>
                          </div>
                          <div className={stylesModule['wrapper-item']}>
                            <div className={stylesModule.icon}>
                              <img src="/images/hrm/smartphone.svg" alt="ImageUpload" />
                              <p className={stylesModule.text}>Hotline</p>
                            </div>
                            <h4 className={stylesModule.textNumber}>0919 292 088</h4>
                          </div>
                        </div>
                      </div>
                      <div className={stylesModule['item-text']}>
                        <h3>{dataPerview?.name}</h3>
                      </div>
                    </div>
                    <Pane className="card p20">
                      <div className="row border-bottom">
                        <div className="col-lg-6">
                          <FormDetail
                            name=""
                            label="Họ tên ứng viên"
                            type={variables.TYPE.TEXT_REQUIRED}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormDetail
                            name=""
                            label="Vị trí ứng tuyển"
                            type={variables.TYPE.TEXT_REQUIRED}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormDetail
                            name=""
                            label="Số điện thoại liên lạc"
                            type={variables.TYPE.TEXT_REQUIRED}
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormDetail label="CV bản thân" type={variables.TYPE.LABEL_REQUIRED} />
                          <div className={stylesModule['wrapper-upload']}>
                            <div className={stylesModule['upload-btn']}>
                              <img src="/images/hrm/cloud-computing.svg" alt="ImageUpload" />
                              <h4 className={stylesModule.text}>Tải lên</h4>
                            </div>
                            <i className={stylesModule.textNote}>
                              Chỉ hỗ trợ định dạng .xlsx. Dung lượng không được quá 5mb
                            </i>
                          </div>
                        </div>
                      </div>
                      <div className="row pt20">
                        {dataPerview?.question?.map((i, index) => (
                          <div className="col-lg-12" key={index}>
                            <FormDetail
                              name=""
                              label={i?.name}
                              type={variables.TYPE.TEXT_REQUIRED}
                            />
                          </div>
                        ))}
                      </div>
                    </Pane>
                  </Pane>

                  <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                    <p
                      className="btn-delete"
                      role="presentation"
                      onClick={() =>
                        history.push('/quan-ly-nhan-su/tuyen-dung/cau-hinh-tuyen-dung')
                      }
                    >
                      Đóng
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      size="large"
                      onClick={() =>
                        history.push(
                          query?.type === 'perview'
                            ? '/quan-ly-nhan-su/tuyen-dung/cau-hinh-tuyen-dung/tao-moi?type=new'
                            : 'chinh-sua?type=perviewDetails',
                        )
                      }
                    >
                      Sửa
                    </Button>
                  </Pane>
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
