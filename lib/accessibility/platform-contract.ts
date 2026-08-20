export type AccessibilityMode =
  | "screen_reader"
  | "keyboard_only"
  | "switch_control"
  | "voice_control"
  | "one_hand_mode"
  | "large_targets"
  | "high_contrast"
  | "reduced_motion"
  | "captions"
  | "live_transcription"
  | "text_to_speech"
  | "speech_to_text"
  | "sign_language_support"
  | "plain_language"
  | "cognitive_support"
  | "color_safe"
  | "haptic_cues";

export interface AccessibilityProfile {
  locale: string;
  preferredLanguage: string;
  fallbackLanguages: string[];
  modes: AccessibilityMode[];
  textScale?: number;
  speechRate?: number;
  captionsAlwaysOn?: boolean;
  preferTextAlternatives?: boolean;
}

export interface AccessibilityAcceptanceResult {
  passed: boolean;
  failures: string[];
}

const REQUIRED_GLOBAL_CAPABILITIES = [
  "keyboard navigation",
  "screen reader semantics",
  "visible focus",
  "text alternatives",
  "captions for prerecorded/live media where applicable",
  "language and locale metadata",
  "error messages not dependent on color alone",
];

export function evaluateAccessibilityAcceptance(input: {
  capabilities: string[];
  supportsRequestedLanguage: boolean;
  blockingMotionWithoutAlternative: boolean;
  touchTargetMinimumMet: boolean;
}): AccessibilityAcceptanceResult {
  const normalized = new Set(input.capabilities.map((item) => item.toLowerCase()));
  const failures = REQUIRED_GLOBAL_CAPABILITIES.filter(
    (requirement) => !normalized.has(requirement),
  ).map((requirement) => `Missing: ${requirement}`);

  if (!input.supportsRequestedLanguage) {
    failures.push("Requested language/localization path is unavailable.");
  }
  if (input.blockingMotionWithoutAlternative) {
    failures.push("Essential interaction depends on motion without an accessible alternative.");
  }
  if (!input.touchTargetMinimumMet) {
    failures.push("Interactive targets do not meet the configured accessibility minimum.");
  }

  return { passed: failures.length === 0, failures };
}

export const ACCESSIBILITY_BENCHMARK_DIMENSIONS = [
  "keyboard-completion-rate",
  "screen-reader-task-completion-rate",
  "voice-control-task-completion-rate",
  "one-hand-task-completion-rate",
  "caption-coverage-rate",
  "translation-success-rate",
  "language-switch-latency",
  "accessible-error-recovery-rate",
  "reduced-motion-completion-rate",
] as const;
