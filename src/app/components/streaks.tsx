import { isToday, isYesterday, startOfDay, differenceInDays, subDays,  format } from "date-fns";

export function getStreakStats(proofs: { createdAt: Date }[]) {
  if (proofs.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastShipped: "Never" };
  }

  // sort proofs by date (newest first) and get unique days only
  const sortedDates = Array.from(
    new Set(proofs.map((p) => startOfDay(new Date(p.createdAt)).getTime()))
  ).sort((a, b) => b - a);

  const today = startOfDay(new Date());
  const mostRecentEntry = new Date(sortedDates[0]);

  // calculate last shipped string
  const lastShippedDate = new Date(proofs[0].createdAt); // Assumes proofs are sorted desc by DB
  const lastShipped = isToday(lastShippedDate) ? "Today" : isYesterday(lastShippedDate) ? "Yesterday" : format(lastShippedDate, "MMM d");

  // check if streak is active (must have shipped today or yesterday)
  const diffFromToday = differenceInDays(today, mostRecentEntry);
  
  let currentStreak = 0;
  if (diffFromToday <= 1) {
    let checkDate = today;
    // if they havent shipped today, start checking from yesterday
    if (diffFromToday === 1) checkDate = startOfDay(subDays(today, 1));

    //  to count backward
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

  // calculate longest streak
  let longest = 0;
  let tempStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0 || sortedDates[i-1] - sortedDates[i] === 86400000) { // = 1 day
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    longest = Math.max(longest, tempStreak);
  }

  return { currentStreak, longestStreak: longest, lastShipped };
}