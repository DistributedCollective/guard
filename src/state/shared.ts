import Safe from '@safe-global/safe-core-sdk';
import { Signer } from 'ethers';
import { produce } from 'immer';
import {
  BehaviorSubject,
  Observable,
  distinctUntilKeyChanged,
  map,
  filter,
  startWith,
} from 'rxjs';

export type SharedState = {
  wallet: WalletState;
  safe: SafeState;
  safeSigner: SafeSignerState;
};

export type WalletState = {
  address: string | null;
  signer: Signer | null;
  connected: boolean;
};

export type SafeState = {
  ready: boolean;
  sdk: Safe | null;
  owners: string[];
  threshold: number;
  error?: string;
};

export type SafeSignerState = SafeState & {
  account: string | null;
};

const INITIAL_STATE: SharedState = {
  wallet: {
    address: '',
    signer: null,
    connected: false,
  },
  safe: {
    ready: false,
    sdk: null,
    owners: [],
    threshold: 0,
  },
  safeSigner: {
    ready: false,
    sdk: null,
    account: null,
    owners: [],
    threshold: 0,
  },
};

const store = new BehaviorSubject<SharedState>(INITIAL_STATE);

type State = (previousState: SharedState) => SharedState;

const dispatch = (state: State) => store.next(state(store.getValue()));

// Selectors
function select(): Observable<SharedState>;
function select<T extends keyof SharedState>(
  stateKey: T,
): Observable<SharedState[T]>;
function select<T extends keyof SharedState>(
  stateKey?: keyof SharedState,
): Observable<SharedState[T]> | Observable<SharedState> {
  if (!stateKey) return store.asObservable();

  const validStateKeys = Object.keys(store.getValue());

  if (!validStateKeys.includes(String(stateKey))) {
    throw new Error(`key: ${stateKey} does not exist on this store`);
  }

  return store.asObservable().pipe(
    startWith(store.getValue()),
    distinctUntilKeyChanged(stateKey),
    map(x => x?.[stateKey]),
    filter(value => value !== null && value !== undefined),
  ) as Observable<SharedState[T]>;
}

const get = (): SharedState => store.getValue();

// Actions
const connectWallet = (address: string, signer: Signer) => dispatch(state => produce(state, draft => {
  draft.wallet.address = address;
  draft.wallet.signer = signer;
  draft.wallet.connected = true;
}));

const disconnectWallet = () => dispatch(state => produce(state, draft => {
  draft.wallet.address = null;
  draft.wallet.signer = null;
  draft.wallet.connected = false;
}));

const connectSdk = (sdk: Safe) => dispatch(state => produce(state, draft => {
  draft.safe.sdk = sdk;
  draft.safe.ready = true;
  draft.safe.error = undefined;
  draft.safe.owners = [];
  draft.safe.threshold = 0;
}));

const disconnectSdk = (error: string) => dispatch(state => produce(state, draft => {
  draft.safe.sdk = null;
  draft.safe.ready = false;
  draft.safe.error = error;
  draft.safe.owners = [];
  draft.safe.threshold = 0;
}));

const saveOwners = (owners: string[]) => dispatch(state => produce(state, draft => {
  draft.safe.owners = owners;
}));

const saveThreshold = (threshold: number) => dispatch(state => produce(state, draft => {
  draft.safe.threshold = threshold;
}));

const connectSignerSdk = (sdk: Safe, account: string) => dispatch(state => produce(state, draft => {
  draft.safeSigner.sdk = null;
  draft.safeSigner.ready = false;
  draft.safeSigner.account = account;
  draft.safeSigner.error = undefined;
}));

const disconnectSignerSdk = (sdk: Safe, account: string) => dispatch(state => produce(state, draft => {
  draft.safeSigner.sdk = null;
  draft.safeSigner.ready = false;
  draft.safeSigner.account = account;
  draft.safeSigner.error = undefined;
}));

export const state = {
  get,
  select,
  actions: {
    connectWallet,
    disconnectWallet,
    connectSdk,
    disconnectSdk,
    saveOwners,
    saveThreshold,
    connectSignerSdk,
    disconnectSignerSdk,
  },
};
