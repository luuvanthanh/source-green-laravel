import { memo, useEffect, useRef } from 'react';
import { Link } from 'umi';
import PropTypes from 'prop-types';
import lottie from "lottie-web";

import styles from './index.scss';

const Index = memo(({ animation, title, url, target }) => {
  let refAnimation = useRef();
  let refCategory = useRef();

  useEffect(() => {
    const animationMenu = lottie.loadAnimation({
      container: refAnimation,
      animationData: animation,
      autoplay: false,
    });

    refCategory.addEventListener('mouseenter', () => {
      animationMenu.setSpeed(1.1);
      animationMenu.play();
    });

    refCategory.addEventListener('mouseleave', () => {
      animationMenu.setSpeed(1.1);
      animationMenu.stop();
    });
  }, []);

  const getSelectorCategory = (element) => {
    refCategory = element;
  };

  const getSelectorAnimation = (element) => {
    refAnimation = element;
  };

  if (target) {
    return (
      <a href={url} target="_blank" className={styles.item} ref={(element) => getSelectorCategory(element)} rel="noreferrer">
        <div
          ref={(element) => getSelectorAnimation(element)}
          className={`${styles.animation}`}
        />
        <div className={styles['item-content']}>
          <p className={styles.norm}>{title}</p>
        </div>
      </a>
    );
  }
  return (
    <Link to={url} className={styles.item} ref={(element) => getSelectorCategory(element)}>
      <div
        ref={(element) => getSelectorAnimation(element)}
        className={`${styles.animation}`}
        style={{ height: 60 }}
      />
      <div className={styles['item-content']}>
        <p className={styles.norm}>{title}</p>
      </div>
    </Link>

  );
});

Index.propTypes = {
  animation: PropTypes.objectOf(PropTypes.any),
  url: PropTypes.string,
  title: PropTypes.string,
  target: PropTypes.bool,
};

Index.defaultProps = {
  animation: {},
  url: '',
  title: '',
  target: false,
};

export default Index;
