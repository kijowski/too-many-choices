import { NowRequest, NowResponse } from '@now/node'
import wordlist from 'wordlist-english'

// eslint-disable-next-line dot-notation
const words = wordlist['english']

export default function (req: NowRequest, res: NowResponse): void {
  const word = words[Math.floor(Math.random() * words.length)]
  res.json(word)
}
