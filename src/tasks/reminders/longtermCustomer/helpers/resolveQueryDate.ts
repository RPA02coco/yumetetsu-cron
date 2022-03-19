import format from 'date-fns/format';
import {subMonths} from 'date-fns';
/**
 * 0 : reminder ✖, actual ✖;
 * 1 : reminder 〇, actual ✖;
 * 2 : reminder 〇, actual 〇;
 */
export type SlackSentStatus = 0 | 1 | 2

export const resolveQueryDate = (slackSentStatus: SlackSentStatus) => {
  let result: string[] = [];
  switch (slackSentStatus) {
    case 0:
      result = [`<= "${format(subMonths(new Date(), 3), 'yyyy-MM-dd')}"`];
      break;
    case 1:
      result = [
        `<= "${format(new Date(), 'yyyy-MM-dd')}"`,
        `> "${format(subMonths(new Date(), 3), 'yyyy-MM-dd')}"`,
      ];
  }

  return result.map((item) => `追客可能時期 ${item}`);
};


// 0 <= 1 Passed
// 2022/01/18 <= 2022/03/18
// 2022/01/18 > 2021/12/18
// Passed

// 2022/11/18 <= 2022/03/18
// 2022/11/18 > 2022/12/18
// Fail