import { atom } from 'recoil';
import { IGirlModel } from '../../models/girl.model';
import { IGuyModel } from '../../models/guy.model';

export interface MeModel extends IGuyModel {
  authorized?: boolean;
}

export const meState = atom<MeModel | null>({
  key: 'meState',
  default: null
});

export const selectedGirlState = atom<IGirlModel | null>({
  key: 'selectedGirlState',
  default: null,
});

export const girlListState = atom<IGirlModel[]>({
  key: 'girlListState',
  default: [],
});

export const girlTotalCountState = atom<number>({
  key: 'girlTotalCountState',
  default: 0,
});
