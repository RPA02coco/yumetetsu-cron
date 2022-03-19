import {APP_IDS, kintoneClient} from '../../../../api/kintone';
import {slackApp} from '../../../../api/slack';

export const reset = async <T extends keyof LongTermCustomerType>() => {
  const result = await kintoneClient.record.getRecords({
    app: APP_IDS.longTermCustomers,
    query: [
      `${'slackSentStatus' as T} > 0`,
      `${'追客可能時期' as T} = ""`,
    ].join(' and '),
  });

  return kintoneClient.record.updateRecords({
    app: APP_IDS.longTermCustomers,
    records: result.records.map((record) => {
      const rec = record as unknown as LongTermCustomerType;
      return {
        id: rec.$id.value,
        record: {
          slackSentStatus: {value: 0},
        },
      };
    }),
  });
};

export const deleteMessages = async <
  T extends keyof LongTermCustomerType
>() => {
  const result = await kintoneClient.record.getRecords({
    app: APP_IDS.longTermCustomers,
    query: [
      // `${'sentToSlackDate' as T} != ""`,
      `${'追客可能時期' as T} = ""`,
      `${'slackChannel' as T} != ""`,
    ].join(' and '),
  });

  const records = result.records as unknown as LongTermCustomerType[];

  /* new Promise(
      (resolve) => setTimeout(
        ()=> resolve(sendRecToSlack(rec, slackSentStatus)),
        idx * globalInterval,
      ),
    ); */
  console.log(records);
  for (const record of records ) {
    const slackResp = await new Promise(
      (resolve) => setTimeout(
        ()=> resolve(
          slackApp.client.chat.delete({
            channel: record.slackChannel.value,
            ts: record.slackTS.value,

          }),
        ), 1000,
      )).catch((err) => console.log(err.message));
    console.log(slackResp);
  }

  return kintoneClient.record.updateRecords({
    app: APP_IDS.longTermCustomers,
    records: records.map((record) => {
      const rec = record as unknown as LongTermCustomerType;
      return {
        id: rec.$id.value,
        record: {
          ['slackSentStatus' as T]: {value: 0},
          ['sentToSlackDate' as T]: {value: ''},
        },
      };
    }),
  });
};