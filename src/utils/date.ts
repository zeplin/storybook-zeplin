function relativeDate(date: number): string {
    const delta = Math.round((new Date().getTime() - new Date(date).getTime()) / 1000);
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const yesterday = day * 2;
    const week = day * 7;
    const month = day * 31;
    const year = month * 12;

    let result;
    if (delta < 2 * minute) {
        result = "now";
    } else if (delta < hour) {
        result = Math.floor(delta / minute) + "min ago";
    } else if (delta < day) {
        result = Math.floor(delta / hour) + "h ago";
    } else if (delta < yesterday) {
        result = "yesterday";
    } else if (delta < week) {
        result = Math.round(delta / day) + "d ago";
    } else if (delta < month) {
        result = Math.round(delta / week) + "w ago";
    } else if (delta < year) {
        result = Math.round(delta / month) + "mth ago";
    } else {
        result = Math.round(delta / year) + "y ago";
    }

    return result;
}

export { relativeDate };
