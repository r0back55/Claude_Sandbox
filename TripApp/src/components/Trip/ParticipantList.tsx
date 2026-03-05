import type { Participant } from '../../types'

interface Props {
  participants?: Record<string, Participant>
}

export default function ParticipantList({ participants }: Props) {
  const list = Object.values(participants ?? {})

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Participants ({list.length})
      </h3>
      {list.length === 0 ? (
        <p className="text-gray-400 text-sm">Waiting for participants to join...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((p) => (
            <li key={p.name} className="flex items-center gap-2 text-gray-800">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
