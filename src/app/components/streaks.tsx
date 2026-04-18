import { isToday, isYesterday, startOfDay, differenceInDays, subDays, format } from "date-fns";
import { toDate } from "date-fns-tz"; 

export function getStreakStats(proofs: { createdAt: Date }[]) {
  if (proofs.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastShipped: "Never" };
  }

  const timeZone = "Asia/Kolkata";

  const today = startOfDay(toDate(new Date(), { timeZone }));

  const sortedDates = Array.from(
    new Set(
      proofs.map((p) => 
        startOfDay(toDate(new Date(p.createdAt), { timeZone })).getTime()
      )
    )
  ).sort((a, b) => b - a);

  const mostRecentEntry = new Date(sortedDates[0]);

  // last shipped using IST
  const lastShippedDate = toDate(new Date(proofs[0].createdAt), { timeZone });
  const lastShipped = isToday(lastShippedDate) 
    ? "Today" 
    : isYesterday(lastShippedDate) 
    ? "Yesterday" 
    : format(lastShippedDate, "MMM d");

  //for  streak 
  const diffFromToday = differenceInDays(today, mostRecentEntry);
  
  let currentStreak = 0;
  if (diffFromToday <= 1) {
    let checkDate = today;
    if (diffFromToday === 1) checkDate = startOfDay(subDays(today, 1));

    for (const time of sortedDates) {
        const d = new Date(time);
        if (differenceInDays(checkDate, d) === 0) {
            currentStreak++;
            checkDate = startOfDay(subDays(checkDate, 1));
        } else {
            break;
        }
    }
  }

  let longest = 0;
  let tempStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0 || (sortedDates[i-1] - sortedDates[i] <= 86400000 && sortedDates[i-1] - sortedDates[i] > 0)) {
      tempStreak++;
    } else if (sortedDates[i-1] - sortedDates[i] > 86400000) {
      tempStreak = 1;
    }
    longest = Math.max(longest, tempStreak);
  }

  return { currentStreak, longestStreak: longest, lastShipped };
}