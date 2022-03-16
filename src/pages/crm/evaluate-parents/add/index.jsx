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
          params={{ error, type: 'container', goBack: '/hinh-anh' }}
        >
          <Pane className="row">
            <Pane className="col-lg-6">
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
            <Pane className="col-lg-6">
              <Pane className="card">
                <Pane style={{ padding: 20 }}>
                  <Pane
                    className="d-flex justify-content-between align-items-center"
                    style={{ marginBottom: 10 }}
                  >
                    <Heading type="form-sub-title">
                      Thông tin phụ huynh đánh giá
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
                          src='https://erp-clover-file.demo.greenglobal.com.vn/file-storage/2021/12/20211202/3a008b7c-1b4e-876b-260f-61e3121c4482.png'
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
                      <h3 className={stylesModule.tilte}>Nguyễn Anh</h3>
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
                  <Pane className="row border-bottom">
                    <Pane className={stylesModule['wrapper-student']}>
                      <Pane className="col-lg-12" >
                        <Heading type="form-block-title">
                          Học sinh
                        </Heading>
                      </Pane>
                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.title}>Hãy dùng 3 tính từ chính xác nhất để mô tả về con bạn?</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.description}>Thông minh, lanh lợi, hiếu động</h3>
                      </Pane>

                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.title}>Liệt kê những biểu hiện về sự phát triển hoặc hành động của trẻ trong thời gian 1 tháng gần đây?</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.description}>Bé dạo này ngủ rất ít, khó ngủ</h3>
                      </Pane>

                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.title}>Bé có những điểm nổi trội nào hoặc chậm hơn so với độ tuổi khiến ba mẹ vui hoặc lo lắng?</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.description}>Không có</h3>
                      </Pane>

                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.title}>Bé có điều gì cần được lưu ý kĩ không? (Sức khỏe, vận động, tinh thần, nhận thức)</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.description}>Bé hay bị mệt người</h3>
                      </Pane>

                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.title}>Khi bé có phản ứng mạnh về điều gì đó ba mẹ thường làm gì? Hãy chia sẻ cách ba mẹ đã tương tác với con khi con bộc lộ cảm xúc mạnh.</h3>
                      </Pane>
                      <Pane className="col-lg-12 ">
                        <h3 className={stylesModule.descriptions}>Mình thường nói nhỏ nhẹ một cách tình cảm và nhẹ nhàng khuyên bảo bé</h3>
                      </Pane>
                    </Pane>
                  </Pane>

                  <Pane className="row border-bottom pt15">
                    <Pane className={stylesModule['wrapper-student']}>
                      <Pane className="col-lg-12" >
                        <Heading type="form-block-title">
                          Vấn đề khó khăn
                        </Heading>
                      </Pane>
                      <Pane className="col-lg-12 p15">
                        <h3 className={stylesModule.description}>Sức khỏe yếu</h3>
                      </Pane>

                      <Pane className="col-lg-12 p15">
                        <h3 className={stylesModule.description}>Các vấn đề về tiêu hóa, các cơ quan nội tạng</h3>
                      </Pane>

                      <Pane className="col-lg-12 p15">
                        <h3 className={stylesModule.descriptions}>Nhút nhát khi gặp người lạ</h3>
                      </Pane>
                    </Pane>
                  </Pane>

                  <Pane className="row pt15">
                    <Pane className={stylesModule['wrapper-student']}>
                      <Pane className="col-lg-12" >
                        <Heading type="form-block-title">
                          Thông tin khác
                        </Heading>
                      </Pane>

                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.title}>Những vấn đề khác</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.description}>Bé lâu lâu hay buồn đột xuất</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.title}>Những kỳ vọng của cha mẹ khi cho bé theo học tại Clover ở như bậc mầm non</h3>
                      </Pane>
                      <Pane className="col-lg-12">
                        <h3 className={stylesModule.descriptions}>Mong bé khỏe mạnh, vui vẻ và hoạt bát hơn nữa</h3>
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
