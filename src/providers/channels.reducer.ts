import type { ChannelId } from '../managers/AudioManager';

export type Channels = {
  [key in ChannelId]: string[];
};

export const initState: Channels = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
};

export enum Actions {
  ADD_FILTER = 'ADD_FILTERS',
  REMOVE_FILTER = 'REMOVE_FILTERS',
}
export const reducer = (
  state: Channels,
  {
    type,
    payload,
  }: { type: Actions; payload: { channelId: ChannelId; filter: string } },
) => {
  switch (type) {
    case Actions.ADD_FILTER:
      return {
        ...state,
        [payload.channelId]: [...state[payload.channelId], payload.filter],
      };

    case Actions.REMOVE_FILTER:
      return {
        ...state,
        [payload.channelId]: state[payload.channelId].filter(
          (filter) => filter != payload.filter,
        ),
      };
    default:
      throw new Error('No real action');
  }
};
