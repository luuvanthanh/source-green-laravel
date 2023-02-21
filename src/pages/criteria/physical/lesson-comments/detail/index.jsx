import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { Divider, Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'umi';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Loading from '@/components/CommonComponent/Loading';
import { Helper, variables } from '@/utils';
import ImgDetail from '@/components/CommonComponent/imageDetail';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import variablesModules from '../utils/variables';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const mounted = useRef(false);
  const type = new URLSearchParams(window.location.search)?.get('type');

  const {
    menuLeftCriteria,
    loading: { effects },
  } = useSelector(({ menu, loading, PhysicalLessonCommentsAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    years: PhysicalLessonCommentsAdd.years,
    error: PhysicalLessonCommentsAdd.error,
  }));

  const [details, setDetails] = useState(undefined);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'PhysicalLessonCommentsAdd/GET_DATA',
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

  const getContent = (items, textContent) => {
    let result = '';
    result = items?.join('\n')?.concat(`\n${textContent}`);
    return result;
  };
  return (
    <div className={stylesModule['wraper-container-quarterReport']}>
      <Breadcrumbs last={params.id ? `Nhận xét ${details?.student?.fullName}` : 'Tạo mới'} menu={menuLeftCriteria} />
      <Helmet title="Nhận xét tiết học" />
      <Loading
        loading={effects['PhysicalLessonCommentsAdd/GET_DATA']}
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
                  Nhận xét ngày {Helper.getDate(details?.joinedDate, variables.DATE_FORMAT.DATE)}
                </Heading>
                <div className="row" style={{ paddingLeft: 15, paddingRight: 15 }} >
                  <div className={stylesModule['quarterReport-header-img']}>
                    <ImgDetail
                      fileImage={details?.student?.fileImage}
                    />
                    <div className='d-block ml20'>
                      <h3 className={stylesModule['general-fullName']}>
                        {details?.student?.fullName}
                      </h3>
                      <p className={stylesModule['general-age']}>{details?.student?.age} tháng tuổi</p>
                    </div>
                  </div>
                </div>
                <Divider />
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={`${details?.schoolYear?.yearFrom} - ${details?.schoolYear?.yearTo}`}
                      label="Năm học"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={details?.class?.branch?.name}
                      label="Cơ sở"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={details?.class?.name}
                      label="Lớp"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={Helper.getDate(details?.joinedDate, variables.DATE_FORMAT.DATE)}
                      label="Ngày nhận xét"
                    />
                  </Pane>
                </Pane>
                <Divider />
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={details?.physicalStudyProgram?.name}
                      label="Chương trình học"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={details?.physicalStudyProgramSession?.name}
                      label="Bài học"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={`${details?.creator?.name} lúc ${Helper.getDate(details?.joinedDate, variables.DATE_FORMAT.DATE_TIME)}`}
                      label="Giáo viên nhận xét"
                    />
                  </Pane>
                  {
                    type === variablesModules.STATUS.APPROVED_FEEDBACK && (
                      <Pane className="col-lg-3">
                        <FormDetail
                          name={`${details?.approvedEmployee?.name} lúc ${Helper.getDate(details?.approvedDate, variables.DATE_FORMAT.DATE_TIME)}`}
                          label="Người duyệt"
                        />
                      </Pane>
                    )
                  }
                </Pane>
              </Pane>
            </Form>
          </Pane>
          <Pane className="card p20">
            {
              isEmpty(details?.templates) ? <></> : details?.templates?.map((item, index) => (
                <Pane className={classnames("pb20 mb20", { "border-bottom": index !== details?.templates?.length - 1 })} key={item?.id}>
                  <Heading type="form-title" className="mb20">
                    {item?.template?.name}
                  </Heading>
                  <Pane className="col-lg-12 p-0">
                    <FormDetail
                      name={getContent(item?.template?.content?.items?.map(i => i?.item), item?.content)}
                      label="Nội dung nhận xét"
                      type="TextArea"
                    />
                  </Pane>
                </Pane>
              ))
            }
          </Pane>
          <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
            <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
              Đóng
            </p>
          </Pane>
        </Pane>
      </Loading>
    </div >
  );
});

export default Index;
