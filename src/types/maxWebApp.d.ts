interface MaxUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface MaxBackButton {
  isVisible: boolean;
  show(): void;
  hide(): void;
  onClick(callback: () => void): void;
  offClick(callback: () => void): void;
}

interface MaxHapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft', disableVibration?: boolean): void;
  notificationOccurred(type: 'error' | 'success' | 'warning', disableVibration?: boolean): void;
  selectionChanged(disableVibration?: boolean): void;
}

interface MaxWebApp {
  initData: string;
  initDataUnsafe: {
    user?: MaxUser;
    chat?: { id: number; type: string };
    auth_date?: number;
    hash?: string;
  };
  platform: 'ios' | 'android' | 'desktop' | 'web';
  version: string;
  BackButton: MaxBackButton;
  HapticFeedback: MaxHapticFeedback;
  ready(): void;
  close(): void;
  openLink(url: string): void;
  openMaxLink(url: string): void;
  shareContent(content: unknown): Promise<unknown>;
  shareMaxContent(content: unknown): Promise<unknown>;
  downloadFile(url: string, fileName: string): Promise<unknown>;
  requestContact(): Promise<{ phone: string; auth_date: number; hash: string }>;
  enableVerticalSwipes(): void;
  disableVerticalSwipes(): void;
  isVerticalSwipesEnabled: boolean;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  onEvent(eventName: string, callback: (data: unknown) => void): void;
  offEvent(eventName: string, callback: (data: unknown) => void): void;
}

interface Window {
  WebApp?: MaxWebApp;
}
