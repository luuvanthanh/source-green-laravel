import { memo, useState } from 'react'
import { Modal, Timeline } from 'antd'
import { MapContainer, TileLayer } from 'react-leaflet';
import { Scrollbars } from 'react-custom-scrollbars';

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Text from '@/components/CommonComponent/Text'
import AvatarTable from '@/components/CommonComponent/AvatarTable'

import styles from '@/assets/styles/Common/information.module.scss';
import 'leaflet/dist/leaflet.css';

const details = {}

const { Item: TimelineItem } = Timeline

const mockData = [
  { time: '07:12', location: 'Điểm đón số 1: Số 45 Hoàng Hoa Thám' },
  { time: '07:13', location: 'Điểm đón số 2: Số 245 Hoàng Hoa Thám' },
  { location: 'Điểm đón số 3: Số 400 Hoàng Hoa Thám' },
  { location: 'Điểm đón số 4' },
]

const Index = memo((props) => {
  const [position] = useState([16.07176, 108.223961])

  return (
    <Modal
      {...props}
      title="Lộ trình xe bus"
      bodyStyle={{ padding: 0 }}
      footer={null}
      width="80%"
    >
      <Pane className="row">
        <Pane className="col-lg-5">
          <Pane className="p20 border-bottom">
            <Heading type="form-title">Đón trẻ 10/1/2021</Heading>
            <Text size="normal">Số trẻ đã lên xe bus: <b>8/12</b></Text>
          </Pane>

          <Pane className="p20 border-bottom">
            <Pane className="row">
              <Pane className="col-lg-6">
                <label className={styles.infoLabel}>Cơ sở</label>
                <Pane className="d-flex align-items-center">
                  <span className={styles.circleIcon}>
                    <span className={'icon-school'} />
                  </span>
                  <span className={styles.infoText}>
                    {details?.position?.name || 'Lake view'}
                  </span>
                </Pane>
              </Pane>

              <Pane className="col-lg-6">
                <label className={styles.infoLabel}>Lớp</label>
                <Pane className="d-flex align-items-center">
                  <span className={styles.circleIcon}>
                    <span className={'icon-open-book'} />
                  </span>
                  <span className={styles.infoText}>{details?.class?.name || 'Preschool'}</span>
                </Pane>
              </Pane>
            </Pane>
          </Pane>

          <Pane className="p20 border-bottom">
            <label className={styles.infoLabel}>Nhân viên</label>
            <Pane className={styles.userInformation}>
              <AvatarTable />
              <Pane>
                <h3>{'Lê Thị Vân'}</h3>
                <p>{'Bảo mẫu - Cơ sở 1 '}</p>
              </Pane>
            </Pane>
          </Pane>

          <Pane className="p20">
            <label className={styles.infoLabel}>Chi tiết</label>

            <Scrollbars autoHeight autoHeightMax={220}>
              <Pane className="pt20">
                <Timeline>
                  {mockData.map(({ time, location }, index) => (
                    <TimelineItem key={index}>
                      <Text size="normal"><b>{time}</b></Text>
                      <Text size="normal" color={!!time ? "success" : "dark-opacity"}>{location}</Text>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Pane>
            </Scrollbars>
          </Pane>
        </Pane>

        <Pane className="col-lg-7">
          <MapContainer
            style={{ height: '60vh' }}
            center={position}
            scrollWheelZoom
            zoom={15}
            maxZoom={22}
          >
            <TileLayer
              url="http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              maxNativeZoom="23"
              minZoom="0"
              maxZoom="23"
            />
          </MapContainer>
        </Pane>
      </Pane>
    </Modal>
  )
})

export default Index
