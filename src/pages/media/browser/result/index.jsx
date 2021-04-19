import { memo } from 'react'
import { Helmet } from 'react-helmet';
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import csx from 'classnames'

import Pane from '@/components/CommonComponent/Pane'
import Heading from '@/components/CommonComponent/Heading'
import Button from '@/components/CommonComponent/Button'
import NoData from '@/components/CommonComponent/NoData'

import infoStyles from '@/assets/styles/Common/information.module.scss'
import styles from '../style.module.scss'

const Index = memo(() => {
  return (
    <>
      <Helmet title="Duyệt hình" />
      <Pane className="p20">
        <Pane className="d-flex mb20">
          <Heading type="page-title">Kết quả lọc hình ảnh</Heading>
          <Button
            className="ml-auto"
            color="success"
            icon="send"
            onClick={() => { }}
          >
            Gửi tất cả
          </Button>
        </Pane>

        {false
          ? (
            <Pane className="card p20">
              <NoData />
            </Pane>
          )
          : (
            <Pane>
              {new Array(2).fill(null).map((v, index) => (
                <Pane className="card p20" key={index}>
                  <Pane className="mb15 row">
                    <Pane className="col">
                      <Pane className={infoStyles.userInformation}>
                        <Avatar shape="square" size={50} icon={<UserOutlined />} />
                        <Pane>
                          <h3>Nguyễn Văn Đức</h3>
                          <p>Lake view - Preschool 1</p>
                        </Pane>
                      </Pane>
                    </Pane>
                    <Pane className="col d-flex justify-content-end align-items-center">
                      <Pane className="mr10">
                        <label className={infoStyles.infoLabel}>Thời gian tải lên:</label>
                        <span className={infoStyles.infoText} >15:30, 15/3/2021</span>
                      </Pane>
                      <Button
                        color="success"
                        onClick={() => { }}
                      >
                        Gửi
                      </Button>
                    </Pane>
                  </Pane>

                  <Pane className="mb15">
                    <label className={infoStyles.infoLabel}>Mô tả</label>
                    <Pane className="p10 border">
                      <span className={infoStyles.infoText}>
                        Bé vui chơi
                      </span>
                    </Pane>
                  </Pane>

                  <Pane className="row">
                    {new Array(3).fill(null).map((v, index) => (
                      <Pane
                        className={csx("col-lg-2 my10", styles.imageWrapper)}
                        key={index}
                      >
                        <img
                          className="d-block w-100"
                          src={'https://picsum.photos/300/200'}
                          alt={`student-image-${index}`}
                        />

                        <Button
                          icon="cancel"
                          className={styles.close}
                        />
                      </Pane>
                    ))}
                  </Pane>
                </Pane>
              ))}
            </Pane>
          )
        }

        <Pane>
          <Button
            className="mx-auto"
            color="success"
            icon="send"
            onClick={() => { }}
          >
            Gửi tất cả
          </Button>
        </Pane>
      </Pane>
    </>
  )
})

export default Index
