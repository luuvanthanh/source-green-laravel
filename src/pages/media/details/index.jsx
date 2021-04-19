import { memo, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useRouteMatch } from 'umi'
import { useSelector, useDispatch } from 'dva'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Loading from '@/components/CommonComponent/Loading';

import { variables, Helper } from '@/utils'
import styles from '@/assets/styles/Common/information.module.scss'

const Index = memo(() => {
  const dispatch = useDispatch()
  const [{ details, error }, loading] = useSelector(({ mediaDetails, loading }) => [mediaDetails, loading?.effects])

  const { params } = useRouteMatch()

  const fetchDetailsMedia = () => {
    dispatch({
      type: 'mediaDetails/GET_DETAILS',
      payload: params
    })
  }

  useEffect(() => {
    fetchDetailsMedia()
  }, [])

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Loading loading={loading['mediaDetails/GET_DETAILS']} isError={error.isError} params={{ error, type: 'container' }}>
        <Helmet title="Chi tiết ghi nhận" />
        <Pane className="row" style={{ marginBottom: 20 }}>
          <Pane className="col">
            <Heading type="page-title">Chi tiết ghi nhận</Heading>
          </Pane>
        </Pane>

        <Pane className="card">
          <Pane className="border-bottom" style={{ padding: 20 }}>
            <Pane style={{ marginBottom: 10 }}>
              <Heading type="form-sub-title">
                {Helper.getDate(details, variables.DATE_FORMAT.DATE_TIME)}
              </Heading>
            </Pane>
            <Pane style={{ marginBottom: 10 }}>
              <Heading type="form-sub-title">
                Mã ID: {details?.id}
              </Heading>
            </Pane>
            <Pane style={{ marginBottom: 20 }}>
              <Heading type="page-title">{details?.description}</Heading>
            </Pane>

            <Pane className="row">
              {(details?.files || []).map(({ id, name, url }) => (
                <Pane className="col-lg-2" key={id}>
                  <img
                    className="d-block w-100"
                    src={`${API_UPLOAD}${url}`}
                    alt={name}
                  />
                </Pane>
              ))}
            </Pane>
          </Pane>

          <Pane className="border-bottom" style={{ padding: 20 }}>
            <Pane className="row">
              <Pane className="col-lg-3">
                <label className={styles.infoLabel}>Phụ huynh</label>
                <Pane className={styles.userInformation}>
                  <AvatarTable fileImage={details?.parent?.fileImage} />
                  <Pane>
                    <h3>{details?.parent?.fullName || 'Nguyễn Anh'}</h3>
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="col-lg-3">
                <label className={styles.infoLabel}>Học sinh</label>
                <Pane className={styles.userInformation}>
                  <AvatarTable fileImage={details?.student?.fileImage} />
                  <Pane>
                    <h3>{details?.student?.fullName || 'Su Beo'}</h3>
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="col-lg-3">
                <label className={styles.infoLabel}>Cơ sở</label>
                <Pane className="d-flex align-items-center">
                  <span className={styles.circleIcon}>
                    <span className={'icon-school'} />
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
                    <span className={'icon-open-book'} />
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
                  <AvatarTable fileImage={details?.teacher?.fileImage} />
                  <Pane>
                    <h3>{details?.teacher?.fullName || 'Lê Thị Vân'}</h3>
                    {/* <p>{details?.teacher?.position}</p> */}
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Loading>
    </Pane >
  )
})

export default Index
