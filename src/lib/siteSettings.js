import { supabase, isSupabaseConfigured } from './supabaseClient';

export const HOME_SETTINGS_KEY = 'home_profile';
export const DEFAULT_LEARNING_START_DATE = '2024-11-27';

export const emptyHomeSettings = {
  stats: {
    certificates: '',
    projects: '',
    years: '',
    learningStartDate: DEFAULT_LEARNING_START_DATE
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
      ...(value.stats || {}),
      learningStartDate: value.stats?.learningStartDate || DEFAULT_LEARNING_START_DATE
    },
    about: {
      ...emptyHomeSettings.about,
      ...(value.about || {}),
      competencies: Array.isArray(value.about?.competencies) ? value.about.competencies : []
    }
  };
}

function formatLearningYears(startDateValue) {
  const start = new Date(`${startDateValue || DEFAULT_LEARNING_START_DATE}T00:00:00`);
  const now = new Date();

  if (Number.isNaN(start.getTime()) || now < start) return '0';

  let elapsedMonths = (now.getFullYear() - start.getFullYear()) * 12;
  elapsedMonths += now.getMonth() - start.getMonth();

  if (now.getDate() < start.getDate()) {
    elapsedMonths -= 1;
  }

  const completedHalfYears = Math.max(0, Math.floor(elapsedMonths / 6));
  const years = completedHalfYears * 0.5;

  if (years <= 0) return '0';
  return `${Number.isInteger(years) ? years.toFixed(0) : years.toFixed(1)}+`;
}

async function countTableRows(table) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true });

  if (error) {
    console.error(`Error counting ${table}:`, error);
    return null;
  }

  return count ?? 0;
}

async function withAutoStats(settings) {
  if (!isSupabaseConfigured) return settings;

  const [certificates, projects] = await Promise.all([
    countTableRows('certifications'),
    countTableRows('projects')
  ]);

  return {
    ...settings,
    stats: {
      ...settings.stats,
      certificates: String(certificates ?? settings.stats.certificates ?? '0'),
      projects: String(projects ?? settings.stats.projects ?? '0'),
      years: formatLearningYears(settings.stats.learningStartDate)
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
  return withAutoStats(normalizeHomeSettings(data?.value));
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
