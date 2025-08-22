// NO 'use client' here
export const dynamic = 'force-dynamic'
export const revalidate = 0

import CaseClient from './CaseClient'

export default function Page() {
  return <CaseClient />
}
