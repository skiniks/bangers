import { useEffect, useState } from 'react'
import type { AtpSessionData, AtpSessionEvent } from '@atproto/api'
import { BskyAgent } from '@atproto/api'

export function useBskyAgent(): [BskyAgent | null, boolean] {
  const [agent, setAgent] = useState<BskyAgent | null>(null)
  const [agentReady, setAgentReady] = useState(false)

  useEffect(() => {
    const initAgent = new BskyAgent({
      service: 'https://bsky.social',
      persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
        if (evt === 'create' || evt === 'update')
          localStorage.setItem('sessionData', JSON.stringify(sess))
        else if (evt === 'expired')
          localStorage.removeItem('sessionData')
      },
    })

    const resumeSession = async () => {
      const storedSession = localStorage.getItem('sessionData')
      if (storedSession) {
        try {
          await initAgent.resumeSession(JSON.parse(storedSession) as AtpSessionData)
          setAgent(initAgent)
          setAgentReady(true)
        }
        catch (error) {
          console.error('Failed to resume session:', error)
          localStorage.removeItem('sessionData')
          setAgentReady(true)
        }
      }
      else {
        setAgent(initAgent)
        setAgentReady(true)
      }
    }

    resumeSession()
  }, [])

  return [agent, agentReady]
}
