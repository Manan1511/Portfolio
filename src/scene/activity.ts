export function activityAt(elapsed: number): string {
  if (elapsed < 2000) return 'talking';
  return (elapsed - 2000) % 5000 < 2000 ? 'typing' : 'seated-idle';
}
