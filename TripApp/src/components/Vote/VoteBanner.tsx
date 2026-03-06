import { castVote, closeVote, proposeVote } from '../../services/vote'
import type { Vote, Identity } from '../../types'

interface Props {
  tripId: string
  identity: Identity
  vote: Vote | null
  hasRestStop: boolean
  onSetMeetingPoint: () => void
}

export default function VoteBanner({ tripId, identity, vote, hasRestStop, onSetMeetingPoint }: Props) {
  const myVote = vote?.votes?.[identity.uid]
  const yesCount = Object.values(vote?.votes ?? {}).filter((v) => v === 'yes').length
  const noCount = Object.values(vote?.votes ?? {}).filter((v) => v === 'no').length
  const totalVotes = yesCount + noCount

  const handlePropose = (): void => {
    proposeVote(tripId, identity.uid, identity.name)
  }

  const handleVote = (v: 'yes' | 'no'): void => {
    castVote(tripId, identity.uid, v)
  }

  const handleClose = (): void => {
    closeVote(tripId)
  }

  // No active vote — show propose button (+ meeting point for organizer)
  if (!vote || vote.status !== 'active') {
    return (
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between gap-2">
        <span className="text-sm text-gray-500 shrink-0">Need a break?</span>
        <div className="flex items-center gap-2">
          {identity.isOrganizer && (
            <button
              onClick={onSetMeetingPoint}
              disabled={hasRestStop}
              className={`text-xs font-medium border px-3 py-1.5 rounded-lg transition-colors ${
                hasRestStop
                  ? 'bg-amber-100 text-amber-600 border-amber-200 cursor-default'
                  : 'bg-white text-amber-600 border-amber-300 hover:bg-amber-50'
              }`}
            >
              {hasRestStop ? '📍 Set' : '📍 Pin'}
            </button>
          )}
          <button
            onClick={handlePropose}
            className="text-sm font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Rest Stop?
          </button>
        </div>
      </div>
    )
  }

  // Active vote
  return (
    <div className="bg-indigo-50 border-t border-indigo-200 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-semibold text-indigo-800">Rest Stop Proposed</span>
          <span className="text-xs text-indigo-500 ml-2">by {vote.proposedBy}</span>
        </div>
        <button
          onClick={handleClose}
          className="text-xs text-indigo-400 hover:text-indigo-700 transition-colors"
        >
          Close
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleVote('yes')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            myVote === 'yes'
              ? 'bg-green-500 text-white border-green-500'
              : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
          }`}
        >
          Yes {myVote === 'yes' && '✓'}
        </button>
        <button
          onClick={() => handleVote('no')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            myVote === 'no'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
          }`}
        >
          No {myVote === 'no' && '✓'}
        </button>
      </div>

      {totalVotes > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full h-2 overflow-hidden border border-indigo-100">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(yesCount / totalVotes) * 100}%` }}
            />
          </div>
          <span className="text-xs text-indigo-600 shrink-0">
            {yesCount} Yes · {noCount} No
          </span>
        </div>
      )}

      {identity.isOrganizer && (
        <button
          onClick={onSetMeetingPoint}
          disabled={hasRestStop}
          className={`mt-2 w-full py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            hasRestStop
              ? 'bg-amber-100 text-amber-600 border-amber-200 cursor-default'
              : 'bg-white text-amber-600 border-amber-300 hover:bg-amber-50'
          }`}
        >
          {hasRestStop ? '📍 Meeting point set' : '📍 Set meeting point on map'}
        </button>
      )}
    </div>
  )
}
