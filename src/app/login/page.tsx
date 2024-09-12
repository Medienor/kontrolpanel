'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (data.success) {
      router.push('/')
    } else {
      setError('Ugyldig brukernavn eller passord')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Logg inn</h2>
          {error && (
            <div className="mb-4 text-center text-red-500">{error}</div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Brukernavn</Label>
              <Input
                id="username"
                type="text"
                placeholder="Skriv inn ditt brukernavn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passord</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-me" />
                <Label htmlFor="remember-me">Husk meg</Label>
              </div>
              <Link href="/glemt-passord" className="text-sm text-blue-600 hover:text-blue-500">
                Glemt passordet?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Logg inn
            </Button>
          </div>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              Har du ikke en konto?{' '}
              <Link href="/registrer" className="font-medium text-blue-600 hover:text-blue-500">
                Registrer deg
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}