import React, { createContext, useEffect, useState } from "react";
import "./calendar.css";
import moment from "jalali-moment";
import ArrowLeft from "../../assets/icons/arrow-left.svg";
import ArrowRight from "../../assets/icons/arrow-right.svg";
import { useQuery } from "react-query";

const Calendar = (props) => {
  let [lang, setLang] = useState("fa");
  let [currentDate, setCurrentDate] = useState(moment().local(lang));
  let [fullDate, setFullDate] = useState();

  let [daysArray, setDaysArray] = useState([]);
  let [isCalendarOpen, setIsCalendarOpen] = useState(false);
  let [checkin, setCheckin] = useState();
  let [checkout, setCheckout] = useState();
  let [formats, setFormats] = useState();

  const createCalendar = () => {
    let firstDay = moment(currentDate).startOf("jMonth");
    let lastDay = moment(currentDate).endOf("jMonth");
    let day = firstDay.clone();
    let daysInMonth = [];
    while (day.isBefore(lastDay)) {
      daysInMonth.push(day);
      day.add(1, "d");
    }
    let days = Array.apply(null, {
      length: daysInMonth.length,
    })
      .map(Number.call, Number)
      .map((day) => {
        return moment(firstDay).add(day, "d");
      });
    for (let i = 0; i < firstDay.weekday(); i++) {
      days.unshift(null);
    }
    setDaysArray(days);
  };
  // const { status, error, data } = useQuery({
  //   queryKey: ["daysArray"],
  //   queryFn: createCalendar,
  // });
  const checkToday = (day) => {
    if (!day) {
      return false;
    }
    if (moment().locale("fa").format("L") === day.format("L")) {
      return true;
    } else {
      return false;
    }
  };
  const isSelected = (day) => {
    if (props.mode === "range") {
      if (!day) {
        return false;
      }
      if (checkin && checkout) {
        return checkin.isSameOrBefore(day) && checkout.isSameOrAfter(day);
      }
      if (checkin) {
        return checkin.isSame(day);
      }
    } else {
    }
  };
  const isBehind = (date) => {
    let today = moment();
    if (!date) {
      return false;
    }
    console.log(today.format("jYYYY-jMM-jDD"));
    return date.format("jYYYY-jMM-jDD") < today.format("jYYYY-jMM-jDD")
      ? true
      : false;
  };
  const nextMonth = () => {
    currentDate.add(1, formats.month);
    setCurrentDate(currentDate);
    createCalendar();
  };
  const previousMonth = () => {
    currentDate.subtract(1, formats.month);
    setCurrentDate(currentDate);
    createCalendar();
  };
  useEffect(() => {
    lang === "fa"
      ? setFormats({
          weekdays: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
          day: "jDay",
          month: "jMonth",
          year: "jYear",
          dayFormat: "jDD",
          monthFormat: "jMM",
          yearFormat: "jYYYY",
          fullDate: "jYYYY-jMM-jDD",
          fullMonth: "jMMMM",
        })
      : setFormats({
          weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
          day: "day",
          month: "month",
          year: "year",
          dayFormat: "DD",
          monthFormat: "MM",
          yearFormat: "YYYY",
          fullDate: "YYYY-DD-MM",
          fullMonth: "MMMM",
        });
  }, [lang]);
  const isCheckin = (day) => {
    if (day) {
      if (
        day?.format(formats?.fullDate) === checkin?.format(formats?.fullDate)
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };
  const isCheckout = (day) => {
    if (day) {
      if (
        day?.format(formats?.fullDate) === checkout?.format(formats?.fullDate)
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };
  const selectDate = (day) => {
    if (props.mode === "range") {
      if (checkin && checkout) {
        setCheckout();
        setCheckin(day);
        return;
      }
      if (!checkin) {
        setCheckin(day);
      } else if (checkin.isSameOrAfter(day)) {
        setCheckin(day);
      } else {
        setCheckout(day);
        // reservedDaysCount = checkout.diff(checkin, "days");
      }
    } else {
      setCheckin(day);
    }
  };

  const handleConfirm = () => {
    if (props.mode === "range") {
      setFullDate(
        `${checkin?.format("YYYY-MM-DD")}, ${
          checkout ? checkout?.format("YYYY-MM-DD") : ""
        }`
      );
    } else {
      setFullDate(checkin?.format("YYYY-MM-DD"));
    }

    setIsCalendarOpen(false);
  };

  return (
    <div className="calendar-container">
      <input
        readOnly={true}
        className="calendar-input"
        onClick={() => {
          setIsCalendarOpen(!isCalendarOpen);
          setTimeout(() => createCalendar(), 1);
        }}
        value={fullDate}
        name="fullDate"
      />
      {isCalendarOpen && (
        <div className="datepicker-section">
          <div className="calender-header">
            <img src={ArrowLeft} onClick={nextMonth} />
            <div style={{ display: "flex", gap: "16px" }}>
              <span>{currentDate.locale(lang).format(formats?.fullMonth)}</span>
              <span>{currentDate.format(formats?.yearFormat)}</span>
            </div>
            <img src={ArrowRight} onClick={previousMonth} />
          </div>
          <div
            className="week-days"
            style={{ direction: lang === "fa" ? "rtl" : "ltr" }}
          >
            {formats.weekdays.map((weekday, index) => {
              return (
                <span key={index} className="weeks">
                  {weekday}
                </span>
              );
            })}
          </div>
          <div
            className="week-days"
            style={{ direction: lang === "fa" ? "rtl" : "ltr" }}
          >
            {daysArray.map((day, index) => {
              // console.log(day?.format(formats.dayFormat));
              return (
                <span
                  key={index}
                  className={`
                ${!day ? "inactive" : ""}
                ${checkToday(day) ? "today" : "day"} 
                ${isSelected(day) ? "selected" : ""}
                ${isBehind(day) ? "disabled" : ""}
                ${isCheckin(day) && props.mode === "range" ? "checkin" : ""}
                ${isCheckout(day) && props.mode === "range" ? "checkout" : ""}
                ${
                  isCheckin(day) && props.mode === "single"
                    ? "single-checkin"
                    : ""
                }
                `}
                  onClick={!isBehind(day) ? () => selectDate(day) : null}
                >
                  {day?.format(formats?.dayFormat)}
                </span>
              );
            })}
          </div>
          <div className="calendar-footer">
            {props.mode === "range" ? (
              <div className="display-date">
                {/* <span>{checkin?.format("jYYYY/jMM/jDD")} :تاریخ ورود</span>
                <span>{checkout?.format("jYYYY/jMM/jDD")} :تاریخ خروج</span> */}
                <span>تاریخ ورود: {checkin?.format("jYYYY/jMM/jDD")}</span>

                <span>تاریخ خروج: {checkout?.format("jYYYY/jMM/jDD")}</span>
              </div>
            ) : (
              <div className="display-date">
                <span>تاریخ انتخابی: {checkin?.format("jYYYY/jMM/jDD")}</span>
              </div>
            )}
            <button className="calendar-button" onClick={handleConfirm}>
              تایید
            </button>
          </div>
          {/* <button
            onClick={() => {
              setLang("en");
              createCalendar("en");
            }}
          >
            تغییر به میلادی
          </button> */}
        </div>
      )}
    </div>
  );
};

export default Calendar;
