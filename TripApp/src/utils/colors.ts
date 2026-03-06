export const PARTICIPANT_COLORS = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
]

export function getParticipantColor(participants: Record<string, unknown>, uid: string): string {
  const index = Object.keys(participants).indexOf(uid)
  return PARTICIPANT_COLORS[index < 0 ? 0 : index % PARTICIPANT_COLORS.length]
}
