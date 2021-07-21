import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { history } from 'umi';
import { useSelector } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import C3Chart from 'react-c3js';

import styles from './index.scss';


const Index = memo(() => {
  const [
    menuData,
  ] = useSelector(({ menu, physicalCreate, loading: { effects } }) => [
    menu.menuLeftPhysical,
    physicalCreate,
    effects,
  ]);

  const mounted = useRef(false);
  const dataHeight = {
    data: {
      x: 'x',
      columns: [
        ['x', '2021-06-01', '2021-07-01', '2021-08-01', '2021-09-01', '2021-10-01','2021-11-01', '2021-12-01', '2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01', '2022-06-01'],
        ['Chiều cao', 30, 30, 35, 35, 40, 45, 50, 70, 80, 80, 80, 90, 100],
      ],
      type: 'spline',
      order: 'asc',
    },
    axis: {
      x : {
        type : 'timeseries',
        tick: {
          format (x) {
            return new Date(x).getMonth() + 1;
          }
        }
      },
      y: {
        label: 'cm',
      },
    },
    color: {
      pattern: ['#27A600'],
    },
  };

  const dataWeight = {
    ...dataHeight,
    data: {
      ...dataHeight.data,
      columns: [
        ['x', '2021-06-01', '2021-07-01', '2021-08-01', '2021-09-01', '2021-10-01','2021-11-01', '2021-12-01', '2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01', '2022-06-01'],
        ['Cân nặng', 5, 5, 5, 5, 5, 7, 7, 7, 10, 10, 7, 8, 10],
      ],
    },
    axis: {
      ...dataHeight.axis,
      y: {
        label: 'kg',
      },
    },
    color: {
      pattern: ['#FF8300'],
    },
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Helmet title="Chi tiết phát triển thể chất học sinh" />
      <Breadcrumbs last="Chi tiết phát triển thể chất học sinh" menu={menuData} />
      <Pane className="p20">
        <div className={styles['container-information-student']}>
          <div
            className={styles['avatar-student']}
            style={{
              backgroundImage: `url('/images/image-default.png')`,
            }}
          />
          <div className={styles['information-student']}>
            <div className="d-flex justify-content-between align-items-center flex-wrap mb20">
              <Heading className={styles.title} type="page-title">Bé Zia</Heading>
              <Button
                color="success"
                icon="plus"
                onClick={() => history.push('/chi-tiet/nhap-the-chat')}
              >
                Nhập thể chất
              </Button>
            </div>
            <div className={styles['detail-information-student']}>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Tuổi (tháng)</p>
                <p className={styles['value-attribute']}>31</p>
              </div>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Cơ sở</p>
                <p className={styles['value-attribute']}>Lake View</p>
              </div>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Lớp</p>
                <p className={styles['value-attribute']}>Presschool 1</p>
              </div>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Chiều cao (cm)</p>
                <p className={styles['value-attribute']}>78</p>
              </div>
              <div className={styles['group-attribute']}>
                <p className={styles['name-attribute']}>Cân nặng (kg)</p>
                <p className={styles['value-attribute']}>
                  9.0<span className="text-danger ml5">(Thiếu cân)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className={styles.block}>
              <Heading className="text-success mb10" type="page-title">BÁO CÁO CHIỀU CAO</Heading>
              <Heading type="page-title">78 cm - Nhập ngày 01/06</Heading>
              <Text size="normal" className="mb20 font-size-14">Biểu đồ báo cáo Tháng 6/2020 - Tháng 06/2021</Text>
              <C3Chart {...dataHeight} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.block}>
              <Heading className="text-success mb10" type="page-title">BÁO CÁO CÂN NẶNG</Heading>
              <Heading type="page-title">7.8 kg - Nhập ngày 01/06</Heading>
              <Text size="normal" className="mb20 font-size-14">Biểu đồ báo cáo Tháng 6/2020 - Tháng 06/2021</Text>
              <C3Chart {...dataWeight} />
            </div>
          </div>
        </div>
      </Pane>
    </>
  );
});

export default Index;
