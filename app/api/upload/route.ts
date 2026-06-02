import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { paramsToSign } = await req.json()
    const timestamp = Math.round(Date.now() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      { ...paramsToSign, timestamp },
      process.env.CLOUDINARY_API_SECRET!
    )
    return NextResponse.json({ signature, timestamp })
  } catch {
    return NextResponse.json({ error: 'Failed to sign upload' }, { status: 500 })
  }
}
