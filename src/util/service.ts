// ["❓unknown","✅typical","⭐️extra","🎁holiday","⚠️planned disruption","🚨unplanned disruption"]
export const typicality = (t: number): string =>
  ["❓ ", "✅ ", "⭐️ ", "🎁 ", "⚠️ ", "🚨 "][t];

export interface Service {
  id: string;
  added_dates: string[];
  added_dates_notes: string[];
  description: string;
  end_date: string;
  rating_description: string;
  rating_end_date: string;
  rating_start_date: string;
  removed_dates: string[];
  removed_dates_notes: string[];
  schedule_name: string;
  schedule_type: string;
  schedule_typicality: number;
  start_date: string;
  valid_days: number[];
}