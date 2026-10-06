import type { User } from './index';

export type { User } from './index';

export type Auth = {
  user: User;
  avatar_url: string | null;
  roles?: string[];
};

export type TwoFactorSetupData = {
  svg: string;
  url: string;
};

export type TwoFactorSecretKey = {
  secretKey: string;
};
