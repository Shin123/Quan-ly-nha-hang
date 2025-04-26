import React from 'react'
import MenuOrder from './menu-order'

export default function GuestMenu() {
  return (
    <div className="max-w-[400px] mx-auto space-y-4">
      <h1 className="text-center text-xl font-bold">🍕 Menu quán</h1>
      <MenuOrder />
    </div>
  )
}
