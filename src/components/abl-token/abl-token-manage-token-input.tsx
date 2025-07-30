'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'

import { redirect } from 'next/navigation'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'

export default function ManageTokenInput() {
  const { publicKey } = useWallet()
  const [tokenAddress, setTokenAddress] = React.useState(() => {
    // Load saved token address from localStorage on component mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastTokenAddress') || ''
    }
    return ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tokenAddress) {
      // Save token address to localStorage before navigating
      localStorage.setItem('lastTokenAddress', tokenAddress)
      redirect(`/manage-token/${tokenAddress.toString()}`)
    }
  }

  if (!publicKey) {
    return (
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Enter Token Address</CardTitle>
          <CardDescription>
            Input your SPL Token-2022 address to manage settings, mint, and send tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-address">Token Address</Label>
              <Input
                id="token-address"
                type="text"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
                placeholder="Enter SPL token address"
                required
                className="font-mono text-sm"
              />
              {tokenAddress && (
                <p className="text-xs text-muted-foreground">
                  Make sure this is a valid SPL Token-2022 address
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg">
              Manage Token
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
