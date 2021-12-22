import PropsType from "prop-types";
import styles from "../style.module.scss";

const CardTime = (props) => {
  const { title } = props;
  return(
    <div className={styles['time-content']}>
      <p className={styles['time-title']}>{title}</p>
    </div>
  );
};

export default CardTime;

CardTime.propTypes = {
  title: PropsType.any,
};

CardTime.defaultProps = {
  title: '',
};