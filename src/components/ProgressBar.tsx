import { View } from 'react-native';

type ProgressBarProps = {
  progress: number;
  color: string;
  trackColor: string;
};

export function ProgressBar({ progress, color, trackColor }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={{
        height: 10,
        borderRadius: 999,
        backgroundColor: trackColor,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: `${clampedProgress * 100}%`,
          height: '100%',
          borderRadius: 999,
          backgroundColor: color,
        }}
      />
    </View>
  );
}
