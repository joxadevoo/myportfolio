import { supabase, isSupabaseConfigured } from './supabaseClient';

export const HOME_SETTINGS_KEY = 'home_profile';

export const emptyHomeSettings = {
  stats: {
    certificates: '',
    projects: '',
    years: ''
  },
  about: {
    location: '',
    status: '',
    focus: '',
    languages: '',
    competencies: []
  }
};

export function normalizeHomeSettings(value = {}) {
  return {
    stats: {
      ...emptyHomeSettings.stats,
      ...(value.stats || {})
    },
    about: {
      ...emptyHomeSettings.about,
      ...(value.about || {}),
      competencies: Array.isArray(value.about?.competencies) ? value.about.competencies : []
    }
  };
}

export async function fetchHomeSettings() {
  if (!isSupabaseConfigured) return emptyHomeSettings;

  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', HOME_SETTINGS_KEY)
    .maybeSingle();

  if (error) throw error;
  return normalizeHomeSettings(data?.value);
}

export async function saveHomeSettings(settings) {
  const payload = normalizeHomeSettings(settings);

  const { error } = await supabase
    .from('site_settings')
    .upsert(
      {
        key: HOME_SETTINGS_KEY,
        value: payload,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'key' }
    );

  if (error) throw error;
  return payload;
}
