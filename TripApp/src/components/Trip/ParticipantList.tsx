import type { Participant } from '../../types'

interface Props {
  participants?: Record<string, Participant>
}

export default function ParticipantList({ participants }: Props) {
  const list = Object.values(participants ?? {})

  return (
    <div>
      <h3>Participants ({list.length})</h3>
      <ul>
        {list.map((p) => (
          <li key={p.name}>{p.name}</li>
        ))}
      </ul>
    </div>
  )
}
