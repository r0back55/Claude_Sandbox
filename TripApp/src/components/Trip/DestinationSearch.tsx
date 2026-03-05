import { useState, useEffect, useRef } from 'react'
import type { Destination } from '../../types'

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

interface Props {
  onSelect: (destination: Destination) => void
}

export default function DestinationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<NominatimResult[]>([])
  const [selected, setSelected] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data: NominatimResult[] = await res.json()
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
  }, [query])

  const handleSelect = (result: NominatimResult): void => {
    const destination: Destination = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.display_name.split(',')[0].trim(),
    }
    setSelected(destination)
    setQuery(result.display_name.split(',')[0].trim())
    setResults([])
    onSelect(destination)
  }

  const handleClear = (): void => {
    setQuery('')
    setSelected(null)
    setResults([])
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(null)
          }}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">...</span>
        )}
        {selected && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {results.map((r) => (
            <li
              key={r.place_id}
              onClick={() => handleSelect(r)}
              className="px-4 py-3 text-sm text-gray-800 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
            >
              <span className="font-medium">{r.display_name.split(',')[0]}</span>
              <span className="text-gray-400 ml-1 text-xs">
                {r.display_name.split(',').slice(1, 3).join(',')}
              </span>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <p className="text-xs text-green-600 mt-1">
          {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
        </p>
      )}
    </div>
  )
}
