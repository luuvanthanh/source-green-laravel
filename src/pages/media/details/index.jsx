import { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch, history } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { Image } from 'antd';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Loading from '@/components/CommonComponent/Loading';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/information.module.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [
    { details, error },
    loading,
    menuLeftMedia,
  ] = useSelector(({ mediaDetails, loading, menu }) => [
    mediaDetails,
    loading?.effects,
    menu?.menuLeftMedia,
  ]);

  const { params } = useRouteMatch();

  const fetchDetailsMedia = () => {
    dispatch({
      type: 'mediaDetails/GET_DETAILS',
      payload: params,
    });
  };

  const remove = () => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'mediaDetails/REMOVE',
          payload: params,
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    });
  };

  useEffect(() => {
    fetchDetailsMedia();
  }, []);

  return (
    <>
      <Helmet title="Chi tiết hình ảnh" />
      <Breadcrumbs last="Chi tiết hình ảnh" menu={menuLeftMedia} />
      <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
        <Loading
          loading={loading['mediaDetails/GET_DETAILS']}
          isError={error.isError}
          params={{ error, type: 'container', goBack: '/hinh-anh' }}
        >
          <Pane className="card">
            <Pane className="border-bottom" style={{ padding: 20 }}>
              <Pane
                className="d-flex justify-content-between align-items-center"
                style={{ marginBottom: 10 }}
              >
                <Heading type="form-sub-title">
                  {Helper.getDate(details?.sentDate, variables.DATE_FORMAT.DATE_TIME)}
                </Heading>
                <p className={styles['text-delete']} role="presentation" onClick={remove}>
                  Xóa hình ảnh
                </p>
              </Pane>
              <Pane style={{ marginBottom: 20 }}>
                <Heading type="page-title">{details?.description}</Heading>
              </Pane>

              <Pane className="row">
                <Pane className="col-lg-12">
                  <Image.PreviewGroup>
                    {(details?.files || []).map(({ id, name, url }) => (
                      <Image
                        key={id}
                        width={200}
                        height={200}
                        src={`${API_UPLOAD}${url}`}
                        alt={name}
                        preview={{
                          maskClassName: 'customize-mask',
                          mask: <></>,
                        }}
                      />
                    ))}
                  </Image.PreviewGroup>
                </Pane>
              </Pane>
            </Pane>

            <Pane className="border-bottom" style={{ padding: 20 }}>
              <Pane className="row">
                <Pane className="col-lg-3">
                  <label className={styles.infoLabel}>Phụ huynh</label>
                  <Pane className={styles.userInformation}>
                    <AvatarTable
                      fileImage={Helper.getPathAvatarJson(
                        details?.studentMaster?.farther?.fileImage ||
                        details?.studentMaster?.mother?.fileImage,
                      )}
                    />
                    <Pane>
                      <h3>
                        {details?.studentMaster?.farther?.fullName ||
                          details?.studentMaster?.mother?.fullName ||
                          ''}
                      </h3>
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="col-lg-3">
                  <label className={styles.infoLabel}>Học sinh</label>
                  <Pane className={styles.userInformation}>
                    <AvatarTable
                      fileImage={Helper.getPathAvatarJson(details?.student?.fileImage)}
                    />
                    <Pane>
                      <h3>{details?.student?.fullName || ''}</h3>
                    </Pane>
                  </Pane>
                </Pane>
                <Pane className="col-lg-3">
                  <label className={styles.infoLabel}>Cơ sở</label>
                  <Pane className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className="icon-school" />
                    </span>
                    <span className={styles.infoText}>
                      {details?.studentMaster?.student?.class?.branch?.name || ''}
                    </span>
                  </Pane>
                </Pane>
                <Pane className="col-lg-3">
                  <label className={styles.infoLabel}>Lớp</label>
                  <Pane className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className="icon-open-book" />
                    </span>
                    <span className={styles.infoText}>{details?.studentMaster?.student?.class?.name || ''}</span>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>

            <Pane className="border-bottom" style={{ padding: 20 }}>
              <Pane className="row">
                <Pane className="col-lg-3">
                  <label className={styles.infoLabel}>Nhân viên</label>
                  <Pane className={styles.userInformation}>
                    <AvatarTable
                      fileImage={Helper.getPathAvatarJson(details?.creator?.objectInfo?.fileImage)}
                    />
                    <Pane>
                      <h3>{details?.creator?.objectInfo?.fullName || 'Admin'}</h3>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Loading>
      </Pane>
    </>
  );
});

export default Index;
