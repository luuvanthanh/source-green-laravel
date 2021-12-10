import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { connect, withRouter } from 'umi';
// import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
    loading,
    details: crmSaleAdmissionAdd.details,
    error: crmSaleAdmissionAdd.error,
    branches: crmSaleAdmissionAdd.branches,
    classes: crmSaleAdmissionAdd.classes,
    students: crmSaleAdmissionAdd.students,
});
const General = memo(
    () => {
        const formRef = useRef();
        const mounted = useRef(false);

        useEffect(() => {
            mounted.current = true;
            return mounted.current;
        }, []);

        return (
            <Pane className={stylesModule['wrapper-child']}>
                <Form layout="vertical" ref={formRef}>
                    <Pane className="card">
                        <Pane className="pb-0 border-bottom">
                            <Pane className={stylesModule['child-title']}>
                                <h3 className={stylesModule.name}>Thông tin đánh giá trẻ</h3>
                                <div className={stylesModule.date}>Thời gian đánh giá: <h3 className={stylesModule.time}>10/11/2021, 10:15</h3></div>
                            </Pane>
                            <Heading type="form-block-title" style={{ paddingTop: 15, paddingLeft: 20 }}>
                                Mô tả chung
                            </Heading>
                            <Pane className={stylesModule['child-content']}>
                                <h3 className={stylesModule.title}>Hãy dùng 3 tính từ chính xác nhất để mô tả về con bạn?</h3>
                                <h3 className={stylesModule.description}>Thông minh, lanh lợi, hiếu động</h3>
                            </Pane>
                            <Pane className={stylesModule['child-content']}>
                                <h3 className={stylesModule.title}>Liệt kê những biểu hiện về sự phát triển hoặc hành động của trẻ trong thời gian 1 tháng gần đây?</h3>
                                <h3 className={stylesModule.description}>Bé dạo này ngủ rất ít, khó ngủ</h3>
                            </Pane>
                            <Pane className={stylesModule['child-content']}>
                                <h3 className={stylesModule.title}>Bé có những điểm nổi trội nào hoặc chậm hơn so với độ tuổi khiến ba mẹ vui hoặc lo lắng?</h3>
                                <h3 className={stylesModule.description}>Không có</h3>
                            </Pane>

                            <Heading type="form-block-title" style={{ paddingTop: 15, paddingLeft: 20, borderTop: "1px solid #EAEAEA" }}>
                                Vấn đề khó khăn
                            </Heading>
                            <Pane className={stylesModule['child-main']}>
                                <h3 className={stylesModule.title}>Sức khỏe yếu</h3>
                            </Pane>
                            <Pane className={stylesModule['child-main']}>
                                <h3 className={stylesModule.title}>Các vấn đề về tiêu hóa, các cơ quan nội tạng</h3>
                            </Pane>

                            <Heading type="form-block-title" style={{ paddingTop: 15, paddingLeft: 20 }}>
                                Thông tin khác
                            </Heading>
                            <Pane className={stylesModule['child-content']}>
                                <h3 className={stylesModule.title}>Những vấn đề khác</h3>
                                <h3 className={stylesModule.description}>Bé lâu lâu hay buồn đột xuất</h3>
                            </Pane>
                            <Pane className={stylesModule['child-content']}>
                                <h3 className={stylesModule.title}>Những kỳ vọng của cha mẹ khi cho bé theo học tại Clover ở như bậc mầm non</h3>
                                <h3 className={stylesModule.description}>Mong bé khỏe mạnh, vui vẻ và hoạt bát hơn nữa</h3>
                            </Pane>

                        </Pane>
                        <Pane className="d-flex justify-content-end p20 ">
                            <Button color="primary" icon="export" className="ml-2">
                                Xuất file đánh giá
                            </Button>
                        </Pane>

                    </Pane>
                </Form>
            </Pane>
        );
    },
);

General.propTypes = {

};

General.defaultProps = {

};

export default withRouter(connect(mapStateToProps)(General));
