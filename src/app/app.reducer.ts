import { App } from '@shared/types/app/app.type';
import { State } from '@app/app.reducers';
import { THEMES } from '@core/theme-switcher.service';

const initialState: App = {
  initialized: false,
  sidenav: {
    isVisible: true,
    mode: 'side',
    collapsed: JSON.parse(localStorage.getItem('sidenavCollapsed')),
    // backgroundColor: '#2E3748',
    // color: '#F6F9FC',
    backgroundColor: '#1b1b1d',
    color: '#a4a4a5',
    toggleButton: {
      isVisible: true,
    },
  },
  toolbar: {
    isVisible: true,
    backgroundColor: '#2e3748',
    color: '#f6f9fc',
    // backgroundColor: 'white',
    // color: '#1A1E2A',
  },
  menu: {
    sandbox: {
      chain: false,
      wallets: false,
    }
  },
  theme: {
    active: 'dark',
    values: THEMES
  },
  statusbar: {
    sandbox: false,
  }
};

export function reducer(state: App = initialState, action): App {

  switch (action.type) {

    case 'APP_INIT_DEFAULT': {
      return {
        ...state,
        menu: initialState.menu,
        statusbar: initialState.statusbar,
      };
    }

    case 'APP_INIT': {

      // TODO: refactor use app features
      let sandboxChain = false;
      let sandboxWallets = false;

      if (action.payload.id === 'sandbox-carthage-tezedge') {
        sandboxChain = true;
        sandboxWallets = true;
      }

      return {
        ...state,
        menu: {
          sandbox: {
            chain: sandboxChain,
            wallets: sandboxWallets,
          }
        },
        statusbar: {
          sandbox: action.payload.id === 'sandbox-carthage-tezedge',
        }
      };
    }

    case 'APP_INIT_SUCCESS': {
      return {
        ...state,
        initialized: true
      };
    }

    case 'APP_THEME_CHANGE': {
      return {
        ...state,
        theme: {
          ...state.theme,
          active: action.payload,
        }
      };
    }

    case 'APP_MENU_STATE_CHANGE': {
      localStorage.setItem('sidenavCollapsed', JSON.stringify(false));
      return {
        ...state,
        sidenav: {
          ...state.sidenav,
          mode: action.payload.mode,
          isVisible: action.payload.mode !== 'over',
          collapsed: false
        }
      };
    }

    case 'APP_MENU_SIZE_CHANGE': {
      localStorage.setItem('sidenavCollapsed', action.payload.collapsed);
      return {
        ...state,
        sidenav: {
          ...state.sidenav,
          collapsed: action.payload.collapsed
        }
      };
    }

    case 'APP_TOGGLE_SIDENAV': {
      return {
        ...state,
        sidenav: {
          ...state.sidenav,
          isVisible: action.payload.isVisible
        }
      };
    }

    case 'SANDBOX_NODE_START_SUCCESS': {
      return {
        ...state,
        statusbar: {
          sandbox: true,
        }
      };
    }

    case 'SANDBOX_NODE_STOP': {
      return {
        ...state,
        statusbar: {
          sandbox: false,
        }
      };
    }

    case 'SIDENAV_VISIBILITY_CHANGE': {
      return {
        ...state,
        sidenav: {
          ...state.sidenav,
          isVisible: action.payload,
        }
      };
    }

    case 'TOOLBAR_VISIBILITY_CHANGE': {
      return {
        ...state,
        toolbar: {
          ...state.toolbar,
          isVisible: action.payload,
        }
      };
    }

    default:
      return state;

  }

}

export const appState = (state: State) => state.app;
export const navigationMenuCollapsing = (state: State) => state.app.sidenav.collapsed;
