const getDMYFormatedDate = (d1: any) => {
  if (d1) {
    const today = new Date(d1);
    const yyyy = today.getFullYear();
    const mm = today.getMonth() + 1;
    const dd = today.getDate();

    const hh = today.getHours();
    const min = today.getMinutes();

    return `${dd < 10 ? `0${dd}` : dd}/${mm < 10 ? `0${mm}` : mm}/${yyyy} ${hh < 10 ? `0${hh}` : hh}:${min < 10 ? `0${min}` : min}`;
  }
  return null;
};

export default getDMYFormatedDate;
