import type { AnalyticsEvent, AnalyticsEventName, AppState } from './types';

export type AnalyticsSink = {
  track: (name: AnalyticsEventName, props?: AnalyticsEvent['props']) => void;
};

export function createMemoryAnalytics(getNow: () => string): {
  sink: AnalyticsSink;
  events: AnalyticsEvent[];
} {
  const events: AnalyticsEvent[] = [];
  return {
    events,
    sink: {
      track(name, props) {
        events.push({ name, at: getNow(), props });
      },
    },
  };
}

export function appendAnalytics(
  state: AppState,
  name: AnalyticsEventName,
  props?: AnalyticsEvent['props'],
): AppState {
  return {
    ...state,
    analytics: [...state.analytics, { name, at: state.now, props }],
  };
}
