import { useDispatch, useSelector } from 'react-redux';
import css from './CalendarItem.module.css';
import { selectWaterNorm } from '../../../../redux/user/selectors';
import { getWaterByDay } from '../../../../redux/water/operations';
import { memo, useMemo } from 'react';
import toast from 'react-hot-toast';

const CalendarItem = ({ day, totalDayWater, isCurrentDate, token, date, isFuture }) => {
  const dispatch = useDispatch();
  const dailyNorm = useSelector(selectWaterNorm);

  const percents = useMemo(
    () => (totalDayWater ? Math.round((totalDayWater / dailyNorm) * 100) : 0),
    [totalDayWater, dailyNorm]
  );

  const dayStyle = isCurrentDate
    ? `${css.buttonDay} ${css.currentDay}`
    : percents > 0
    ? `${css.buttonDay} ${css.normed}`
    : css.buttonDay;

  const disabled = isFuture ? `${dayStyle} ${css.disabled}` : dayStyle;

  const getDayData = () => {
    dispatch(getWaterByDay({ date, token }))
      .unwrap()
      .then(({ totalDayWater }) => {
        if (totalDayWater === 0) return;
        toast.success(`Water intake data successfully retrieved!`, {
          style: { backgroundColor: '#9be1a0', fontWeight: 'medium' },
          iconTheme: { primary: 'white', secondary: 'black' },
        });
      })
      .catch(() => {
        toast.error('Failed to fetch water intake data. Please try again.', {
          style: { backgroundColor: '#FFCCCC', fontWeight: 'medium' },
        });
      });
  };

  return (
    <div className={css.itemBox}>
      <button className={disabled} onClick={getDayData}>
        {day}
      </button>
      <span className={css.infoText}>{`${percents}%`}</span>
    </div>
  );
};

export default memo(CalendarItem);
