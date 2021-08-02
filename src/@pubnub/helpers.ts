import { MessageAction, MessageActionEvent, MessageEvent } from "pubnub";

export interface CMessageEvent extends MessageEvent {
  userMetadata: any
}

export interface CMessageActionEvent extends MessageActionEvent {
  data: MessageAction;
}

export const getMaxReceiptTimeToken = (messageList: any[], receipt_type: string, myUuid: string) => {
  const arrReceiptTimeToken = messageList.filter(message => {
    const actions = message.actions;
    if (!actions) return false;

    const receipts = actions.receipt[receipt_type];
    if (!receipts) return false;

    return receipts.some((item: any) => item.uuid !== myUuid);
  }).map(message => {
    const receipt = message.actions.receipt[receipt_type].find((item: any) => item.uuid !== myUuid);
    if (!receipt) return;

    return Number(message.timetoken);
  }).filter(item => item) as number[];

  const maxReceiptTimeToken = Math.max(...arrReceiptTimeToken);
  if (maxReceiptTimeToken < 0) return "";

  return maxReceiptTimeToken.toString();
}

export const getLastReadMessageTimeToken = (messageActions: MessageAction[], myUuid: string): number => {
  const myMessageActions = messageActions.filter(messageAction => messageAction.uuid === myUuid);

  const myMessageReadActions = myMessageActions.filter(messageAction => messageAction.value === 'message_read')

  if (myMessageReadActions.length > 0) {
    return +myMessageReadActions[myMessageReadActions.length - 1].messageTimetoken
  }

  if (myMessageActions.length > 0) {
    return +myMessageActions[0].messageTimetoken
  }

  return (+ new Date()) * 10000;
}
