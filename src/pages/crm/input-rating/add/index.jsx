import { memo } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, } from 'dva';
import { Image } from 'antd';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';

import Loading from '@/components/CommonComponent/Loading';


import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  // const dispatch = useDispatch();
  const [
    { details, error },
    loading,
    menuLeftCRM,
  ] = useSelector(({ mediaDetails, loading, menu }) => [
    mediaDetails,
    loading?.effects,
    menu?.menuLeftCRM,
  ]);

  // const { params } = useRouteMatch();

  // const fetchDetailsMedia = () => {
  //   dispatch({
  //     type: 'mediaDetails/GET_DETAILS',
  //     payload: params,
  //   });
  // };


  // useEffect(() => {
  //   fetchDetailsMedia();
  // }, []);

  return (
    <>
      <Helmet title="Chi tiết đánh giá" />
      <Breadcrumbs last="Chi tiết đánh giá" menu={menuLeftCRM} />
      <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
        <Loading
          loading={loading['mediaDetails/GET_DETAILS']}
          isError={error.isError}
          params={{ error, type: 'container', goBack: '/ghi-nhan' }}
        >
          <Pane className="row">
            <Pane className="col-lg-12">
              <Pane className="card">
                <Pane style={{ padding: 20 }}>
                  <Pane
                    className="d-flex justify-content-between align-items-center"
                    style={{ marginBottom: 10 }}
                  >
                    <Heading type="form-sub-title">
                      Thông tin trẻ
                    </Heading>
                  </Pane>
                  <Pane style={{ marginBottom: 20 }}>
                    <Heading type="page-title">{details?.description}</Heading>
                  </Pane>

                  <Pane className="row">
                    <Pane className={stylesModule['wrapper-card-img']}>
                      <Image.PreviewGroup>
                        {/* {(details?.files || []).map(({ id, name, url }) => ( */}
                        <Image
                          // key={id}
                          className={stylesModule.wrapperImg}
                          // src={`${API_UPLOAD}${url}`}
                          src='https://erp-clover-file.demo.greenglobal.com.vn/file-storage/2021/12/20211202/3a008b7c-4de3-5e72-74b4-93d6f355ac6b.png'
                          // alt={name}
                          preview={{
                            maskClassName: 'customize-mask',
                            mask: <></>,
                          }}
                        />
                        {/* ))} */}
                      </Image.PreviewGroup>
                    </Pane>
                    <Pane className={stylesModule['wrapper-card-content']}>
                      <h3 className={stylesModule.tilte}>Bùi Ngọc Thy Nhân</h3>
                      <p className={stylesModule.tilte}>Giới tính: Nữ</p>
                      <p className={stylesModule.tilte}>Ngày sinh: 22/10/2019</p>
                      <p className={stylesModule.tilte}>Tuổi: 32 tháng</p>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>

            <Pane className="col-lg-12">
              <Pane className="card p20">
                <Pane className={stylesModule['wrapper-card-main']}>
                  <Pane className="d-flex justify-content-between pb15">
                    <Heading type="form-sub-title">
                      Thông tin đánh giá
                    </Heading>
                    <h3 className={stylesModule.contentDay}>Thời gian đánh giá:
                      <h3 className={stylesModule.time}> 10/11/2021, 10:15 </h3>
                    </h3>
                  </Pane>
                  <Pane className="row border-top">
                    <Pane className={stylesModule['wrapper-container']}>
                      <Pane className="col-lg-12" >
                        <Pane className={stylesModule['wrapper-contentTop']}>
                          <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                          <Pane className="pl15">
                            <h3 className={stylesModule.title}>
                              Tương tác xã hội
                            </h3>
                            <h3 className={stylesModule.description}>Nhận biết được việc làm đúng hoặc sai và có ý kiến cá nhân.</h3>
                            
                          </Pane>
                          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#FFE5B7' }}>
                            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                            <h3 className={stylesModule.tilteLogo}>Cấp độ 30 – 36 tháng</h3>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12 pt20 pb20">
                        <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                      </Pane>

                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Khi bé có phản ứng mạnh về điều gì đó ba mẹ thường làm gì? Hãy chia sẻ cách ba mẹ đã tương tác với con khi con bộc lộ cảm xúc mạnh.</h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Cùng chơi trò chơi thông qua photocard
                            Hành động sai: vượt đèn đỏ, vứt rác, không đội nón bảo hiểm khi ra đường, đánh bạn,…
                            Hành động đúng: chia sẻ đồ chơi cho bạn, giúp đỡ bạn,…không đội nón bảo hiểm khi ra đường, đánh bạn,…
                            Hành động đúng: chia sẻ đồ chơi cho bạn, giúp đỡ bạn</h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Khi bé có phản ứng mạnh về điều gì đó ba mẹ thường làm gì? Hãy chia sẻ cách ba mẹ đã tương tác với con khi con bộc lộ cảm xúc mạnh.</h3>
                        </Pane>
                      </Pane>

                    </Pane>
                  </Pane>

                  <Pane className="row border-top">
                    <Pane className={stylesModule['wrapper-container']}>
                      <Pane className="col-lg-12" >
                        <Pane className={stylesModule['wrapper-contentTop']}>
                          <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                          <Pane className="pl15">
                            <h3 className={stylesModule.title}>
                              Tự lập - tự phục vụ
                            </h3>
                            <h3 className={stylesModule.description}>Biết việc đánh răng - rửa mặt hàng ngày.</h3>
                          </Pane>
                          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#F0D0FF' }}>
                            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                            <h3 className={stylesModule.tilteLogo}>Cấp độ 24 - 30 tháng</h3>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12 pt20 pb20">
                        <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Cho tương tác với bô giáo cụ đánh răng, quan sát quy trình em bé tự làm..</h3>
                        </Pane>
                      </Pane>
                    </Pane>
                  </Pane>

                  <Pane className="row border-top">
                    <Pane className={stylesModule['wrapper-container']}>
                      <Pane className="col-lg-12" >
                        <Pane className={stylesModule['wrapper-contentTop']}>
                          <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                          <Pane className="pl15">
                            <h3 className={stylesModule.title}>
                              Vận động thô
                            </h3>
                            <h3 className={stylesModule.description}>Đi hoặc chạy liên tục khoảng 10m theo hướng thẳng</h3>
                          </Pane>
                          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#C4FFD8' }}>
                            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                            <h3 className={stylesModule.tilteLogo}>Cấp độ 36 - 50 tháng</h3>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12 pt20 pb20">
                        <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Chơi cùng con:
                            Cô có một chiếc túi ( bên trong có chai , trong chai có nhiều đồ vật bất ngờ).
                            Yêu cầu bé: con hãy cho tay vào và lấy 1 vật và khám phá nhé
                            . Bên trong chai có một hạt đậu, bom bom, khối hình học
                          </h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Chơi cùng con:
                            Con hãy giúp cô mở nắp chai để xem bên trong có gì?
                            Từ trò chơi này sẽ đưa ra đánh giá về kĩ năng vận động tinh của bé.
                          </h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Thông qua giáo cụ: đóng mở nắp chai hướng bé để đánh giá vận động tinh.
                          </h3>
                        </Pane>
                      </Pane>
                    </Pane>
                  </Pane>

                  <Pane className="row border-top">
                    <Pane className={stylesModule['wrapper-container']}>
                      <Pane className="col-lg-12" >
                        <Pane className={stylesModule['wrapper-contentTop']}>
                          <img src="/images/mh.svg" alt="group" className={stylesModule.img} />
                          <Pane className="pl15">
                            <h3 className={stylesModule.title}>
                              Ngôn ngữ
                            </h3>
                            <h3 className={stylesModule.description}>Nhận diện các kí hiệu, biểu tượng như nhà vệ sinh nam, nữ, cấm lửa, không vứt rác, không hút thuốc, tín hiệu nguy hiểm, tín hiệu giao thông</h3>
                          </Pane>
                          <Pane className={stylesModule["wrapper-containerLogo"]} style={{ backgroundColor: '#C4FFD8' }}>
                            <img src="/images/capdo.svg" alt="group" className={stylesModule.logo} />
                            <h3 className={stylesModule.tilteLogo}>Cấp độ 36 - 50 tháng</h3>
                          </Pane>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12 pt20 pb20">
                        <h3 className={stylesModule['container-title']}>Hình thức tiếp cận</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Dùng photocard các kí hiệu, biểu tượng và hỏi bé về các hình ảnh đó.
                          </h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Đặt câu hỏi:
                            Cô chỉ vào photocard và hỏi, con có biết đây là hình gì không?
                            Nếu bé không trả lời được thì khơi gợi để bé trả lời.
                            Hỏi 1 số hình ảnh và đưa ra đánh giá về ngôn ngữ của bé

                          </h3>
                        </Pane>
                      </Pane>
                      <Pane className="col-lg-12">
                        <Pane className={stylesModule['wrapper-title']}>
                          <div className={stylesModule.icon} />
                          <h3 className={stylesModule.title}>Thông qua giáo cụ: đóng mở nắp chai hướng bé để đánh giá vận động tinh.
                          </h3>
                        </Pane>
                      </Pane>
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
