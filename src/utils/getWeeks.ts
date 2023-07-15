const stageDropDate = new Date('2023-01-25T19:51:31.386Z');
const liveDropDate = new Date('2023-01-22T19:51:31.386Z');
const today = new Date(Date.now());
// console.log('🚀 ~ file: getWeeks.ts:2 ~ today:', today);
const getWeeks = () => {
  const date = process.env.ENV !== 'production' ? stageDropDate : liveDropDate;
  const dayOfWeek = date.getDay();
  console.log('🚀 ~ file: getWeeks.ts:8 ~ getWeeks ~ dayOfWeek:', dayOfWeek);
  const diff = (dayOfWeek === 0) ? 7 : dayOfWeek; // Calculate the number of days to subtract
  const firstSunday = new Date(date.getTime() - (diff * 24 * 60 * 60 * 1000));
  console.log('🚀 ~ file: getWeeks.ts:10 ~ getWeeks ~ firstSunday:', firstSunday);

  const dayOfWeek2 = today.getDay();
  const diff2 = (dayOfWeek2 === 0) ? 7 : 7 - dayOfWeek2; // Calculate the number of days to add

  const comingSunday = new Date(today.getTime() + (diff2 * 24 * 60 * 60 * 1000));
  console.log('🚀 ~ file: getWeeks.ts:15 ~ getWeeks ~ comingSunday:', comingSunday);
  const allWeeks = getWeeksBetween(firstSunday, comingSunday);
  // console.log('🚀 ~ file: getWeeks.ts:19 ~ getWeeks ~ allWeeks:', allWeeks);
  // allWeeks.map((week) => {
  //   if(week)
  // })
  return allWeeks;
};
function getWeeksBetween(startDate, endDate) {
  const weeksSet = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const weekStartDate = new Date(currentDate.getTime());
    // weekStartDate.setDate(currentDate.getDate()); // Set the start of the week
    weekStartDate.setDate(currentDate.getDate()
    - currentDate.getDay() + 1); // Set the start of the week

    const weekEndDate = new Date(currentDate.getTime());
    weekEndDate.setDate(currentDate.getDate()
    + (6 - currentDate.getDay()) + 1); // Set the end of the week
    const weekRange = `${weekStartDate.toISOString().split('T')[0]} - ${weekEndDate.toISOString().split('T')[0]}`;
    weeksSet.push(weekRange);
    currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
  }
  const weekSet = weeksSet.reverse();
  weekSet.shift();
  return weekSet;
}
export default getWeeks;
