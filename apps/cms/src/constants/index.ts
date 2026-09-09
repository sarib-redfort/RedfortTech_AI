/**
 * Empty defaults for the single-record editors.
 *
 * These exist so the homepage/about forms have a defined shape to render
 * before their data arrives (and when no record has been created yet). They
 * are intentionally blank: this file previously held ~320 lines of mock
 * content that shipped to production and masked an unreachable API by
 * rendering plausible-looking data.
 */
import type { AboutCms, AppSettings, HomepageCms } from '../types';

export const EMPTY_HOMEPAGE: HomepageCms = {
  heroTitle: '',
  heroDescription: '',
  heroImage: '',
  buttonText: '',
  happyClients: '',
  industriesServed: '',
  yearsExperience: '',
  clientSatisfaction: '',
};

export const EMPTY_ABOUT: AboutCms = {
  title: '',
  description: '',
  image: '',
};

export const EMPTY_SETTINGS: AppSettings = {
  siteName: '',
  siteEmail: '',
  sitePhone: '',
  theme: 'Light',
  logoUrl: '',
  socials: {},
};
