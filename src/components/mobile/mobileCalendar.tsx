import React from "react";
import MobileWeeklyView from "./mobileWeeklyView";

export default function CalendarMobile() {
  return (
    <div>
      <MobileWeeklyView startDate={new Date()} />
    </div>
  );
}
