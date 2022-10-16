import { Button, Link } from '@mui/material'

function SendCoffeeButton () {
  const LINK = 'https://toss.me/frebern'
  return (
    <Button
      LinkComponent={Link}
      variant="contained" size="large"
      className="!bg-amber-900 !shadow-sm"
      href={LINK}
      target="_blank"
    >
      개발자에게 커피 사주기!
    </Button>
  )
}

export default SendCoffeeButton
