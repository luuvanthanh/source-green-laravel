import { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useRouteMatch, history } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Loading from '@/components/CommonComponent/Loading';

import { variables, Helper } from '@/utils';
import styles from '@/assets/styles/Common/information.module.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const { confirm } = Modal;
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
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
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
      onCancel() {},
    });
  };

  useEffect(() => {
    fetchDetailsMedia();
  }, []);

  return (
    <>
      <Helmet title="Chi tiết ghi nhận" />
      <Breadcrumbs last="Chi tiết ghi nhận" menu={menuLeftMedia} />
      <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
        <Loading
          loading={loading['mediaDetails/GET_DETAILS']}
          isError={error.isError}
          params={{ error, type: 'container' }}
        >
          <Pane className="card">
            <Pane className="border-bottom" style={{ padding: 20 }}>
              <Pane
                className="d-flex justify-content-between align-items-center"
                style={{ marginBottom: 10 }}
              >
                <Heading type="form-sub-title">
                  {Helper.getDate(details, variables.DATE_FORMAT.DATE_TIME)}
                </Heading>
                <p className={styles['text-delete']} role="presentation" onClick={remove}>
                  Xóa ghi nhận
                </p>
              </Pane>
              <Pane style={{ marginBottom: 20 }}>
                <Heading type="page-title">{details?.description}</Heading>
              </Pane>

              <Pane className="row">
                {(details?.files || []).map(({ id, name, url }) => (
                  <Pane className="col-lg-2" key={id}>
                    <img className="d-block w-100" src={`${API_UPLOAD}${url}`} alt={name} />
                  </Pane>
                ))}
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
                          'Nguyễn Anh'}
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
                      <h3>{details?.student?.fullName || 'Su Beo'}</h3>
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
                      {details?.class?.branch?.name || 'Lake view'}
                    </span>
                  </Pane>
                </Pane>
                <Pane className="col-lg-3">
                  <label className={styles.infoLabel}>Lớp</label>
                  <Pane className="d-flex align-items-center">
                    <span className={styles.circleIcon}>
                      <span className="icon-open-book" />
                    </span>
                    <span className={styles.infoText}>{details?.class?.name || 'Preschool 2'}</span>
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
                      <h3>{details?.creator?.objectInfo?.fullName || 'Lê Thị Vân'}</h3>
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
