import { memo, useRef, useEffect } from 'react';
import { Form, List } from 'antd';
import { Helmet } from 'react-helmet';
import { connect } from 'umi';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import variables from '@/utils/variables';
import styles from '@/assets/styles/Common/information.module.scss';
import { Helper } from '@/utils';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const { Item: ListItem } = List;

const mapStateToProps = ({ loading, user, menu }) => ({
  loading,
  user: user.user,
  menuData: menu.menuLeftNotification,
});
const Index = memo(({ dispatch, loading: { effects }, match: { params }, menuData }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);
  return (
    <>
      <Helmet title="Chi tiết thông báo" />
      <Breadcrumbs last="Chi tiết thông báo" menu={menuData} />
      <Pane className="pr20 pl20">
        <Pane className="row">
          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: 20 }}>
                <Heading type="form-title">Thông tin chung</Heading>
              </Pane>

              <Pane className="border-bottom" style={{ padding: 20 }}>
                <label className={styles.infoLabel}>Người gửi</label>
                <Pane className={styles.userInformation} style={{ paddingBottom: 20 }}>
                  <AvatarTable fileImage={null} />
                  <Pane>
                    <h3>{'Nguyễn Ngọc Bích'}</h3>
                    <p>{'Admin'}</p>
                  </Pane>
                </Pane>
                <p>
                  Thời gian gửi: <strong>10:30, 15/3/2021</strong>
                </p>
                <p>
                  Đối tượng nhận: <strong>Nhân viên</strong>
                </p>
              </Pane>
              <Pane className="border-bottom" style={{ padding: 20 }}>
                <Pane className="row">
                  <Pane className="col-lg-6">
                    <label className={styles.infoLabel}>Cơ sở</label>
                    <Pane className="d-flex align-items-center">
                      <span className={styles.circleIcon}>
                        <span className={'icon-school'} />
                      </span>
                      <span className={styles.infoText}>{'Lake view'}</span>
                    </Pane>
                  </Pane>

                  <Pane className="col-lg-6">
                    <label className={styles.infoLabel}>Lớp</label>
                    <Pane className="d-flex align-items-center">
                      <span className={styles.circleIcon}>
                        <span className={'icon-open-book'} />
                      </span>
                      <span className={styles.infoText}>{'Preschool'}</span>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="border-bottom" style={{ padding: 20 }}>
                <label className={styles.infoLabel}>Người nhận thông báo</label>
                <Pane
                  className={styles.userInformation}
                  style={{ paddingTop: 20, paddingBottom: 20 }}
                >
                  <AvatarTable fileImage={null} />
                  <Pane>
                    <h3>{'Nguyễn Ngọc Bích'}</h3>
                    <p>{'Admin'}</p>
                  </Pane>
                </Pane>
                <Pane className={styles.userInformation} style={{ paddingBottom: 20 }}>
                  <AvatarTable fileImage={null} />
                  <Pane>
                    <h3>{'Nguyễn Ngọc Bích'}</h3>
                    <p>{'Admin'}</p>
                  </Pane>
                </Pane>
                <Pane className={styles.userInformation} style={{ paddingBottom: 20 }}>
                  <AvatarTable fileImage={null} />
                  <Pane>
                    <h3>{'Nguyễn Ngọc Bích'}</h3>
                    <p>{'Admin'}</p>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Pane>

          <Pane className="col-lg-6">
            <Pane className="card">
              <Pane className="border-bottom" style={{ padding: 20 }}>
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Chi tiết
                </Heading>

                <Pane>
                  <label className={styles.infoLabel}>Tiêu đề</label>
                  <p className={styles.infoText}>Tham gia hoạt động ngoại khóa</p>
                </Pane>

                <Pane className="mt10">
                  <label className={styles.infoLabel}>Nội dung</label>
                  <p>
                    Chương trình Ngoại khóa tại Clover Montessori được xây dựng và thiết kế trên
                    những đặc điểm phát triển của trẻ ở lứa tuổi từ 0 tuổi đến 6 tuổi về mặt tâm lý,
                    thể lý, nhận thức, tình cảm và khả năng thích ứng (vượt khó) mang tính chất đủ
                    hấp dẫn, giải trí và thu hút trẻ. Các kỹ năng sẽ được hình thành một cách tự
                    nhiên, thấm hút dần vào trong trẻ, lớp học ngoại khoá là một sân chơi đa dạng
                    nhiều hoạt động nhằm giúp trẻ không cảm thấy áp lực, trẻ chỉ cảm nhận là chơi
                    nên trẻ sẽ được tự do thể hiện tiềm năng theo sở thích và bản chất của chúng.
                  </p>
                </Pane>
              </Pane>
            </Pane>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default connect(mapStateToProps)(Index);
