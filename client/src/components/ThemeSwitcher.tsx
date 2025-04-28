'use client'

import { useTheme } from '@/context/ThemeContext'
import { type ThemeKey } from '@/lib/themes'

const themeKeys: ThemeKey[] = ['teal', 'indigo', 'purple', 'emerald']

const colors: Record<ThemeKey, string> = {
  teal: '#14b8a6',
  indigo: '#6366f1',
  purple: '#a855f7',
  emerald: '#10b981',
}

export default function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme()

  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-2 p-2 bg-black backdrop-blur rounded-full border border-gray-800">
      {themeKeys.map((key) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`w-8 h-8 rounded-full transition-all ${currentTheme === key ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
          style={{ backgroundColor: colors[key] }}
          title={key.charAt(0).toUpperCase() + key.slice(1)}
        />
      ))}
    </div>
  )
}
