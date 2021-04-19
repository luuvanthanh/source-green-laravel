import { memo, } from 'react'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import { useMatch } from 'umi'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import variables from '@/utils/variables'
import styles from '@/assets/styles/Common/information.module.scss'

const mockData = {
  createTime: '2021/3/15 10:30',
  id: 'GN01',
  title: 'Bé vận động',
  images: [
    'https://picsum.photos/300/200',
    'https://picsum.photos/300/200',
  ],
  parents: [{
    name: 'Nguyễn Anh'
  }],
  student: {
    name: 'Su beo'
  },
  position: {
    name: 'Lake view'
  },
  class: {
    name: 'Preschool'
  },
  employee: {
    name: 'Lê Thị Vân',
    position: 'Cơ sở 1'
  }
}

const Index = memo(() => {
  const [{ details, error }, loading] = useSelector(({ mediaItemsDetails, loading }) => [mediaItemsDetails, loading?.effects])

  const { params } = useMatch()

  const fetchDetailsMedia = () => {
    dispatch({
      type: 'mediaItemsDetails/GET_DATA',
      payload: params
    })
  }

  useEffect(() => {
    fetchDetailsMedia()
  }, [])

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Loangding loading={loading['mediaItemsDetails/GET_DATA']} isError={error.isError} params={{ error, type: 'container' }}>
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
                {moment(mockData?.createTime).format(variables.DATE_FORMAT.DATE_TIME_VI)}
                {Helper.getDate(details, variables.DATE_FORMAT.DATE_TIME)}
              </Heading>
            </Pane>
            {/* <Pane style={{ marginBottom: 10 }}>
              <Heading type="form-sub-title">
                Mã ID: {details?.id}
              </Heading>
            </Pane> */}
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
                    <h3>{details?.student?.fullName}</h3>
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
                  <span className={styles.infoText}>{details?.class?.name}</span>
                </Pane>
              </Pane>
            </Pane>
          </Pane>

          <Pane className="border-bottom" style={{ padding: 20 }}>
            <Pane className="row">
              <Pane className="col-lg-3">
                <label className={styles.infoLabel}>Nhân viên</label>
                <Pane className={styles.userInformation}>
                  <AvatarTable fileImage={details?.studentTransporter?.fileImage} />
                  <Pane>
                    <h3>{mockData?.studentTransporter?.fullName}</h3>
                    {/* <p>{mockData?.employee?.position}</p> */}
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Loangding>
    </Pane >
  )
})

export default Index
