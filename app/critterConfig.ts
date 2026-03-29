export const critterConfig = {
  eyes: { label: "Eyes", options: ["tangy", "bob"] as const },
  mouth: { label: "Mouth", options: ["tangy", "bob"] as const },
} as const;

export type EyeVariant = typeof critterConfig.eyes.options[number];
export type MouthVariant = typeof critterConfig.mouth.options[number];
