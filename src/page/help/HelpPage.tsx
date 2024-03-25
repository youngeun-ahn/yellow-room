import { Box, Link, Typography } from '@mui/material'

function HelpPage () {
  return (
    <Box className="f-col-12 w-full max-w-xl px-16 py-24">
      <Typography fontFamily="Roboto" fontSize="2.8rem">
        노란 방
      </Typography>
      <Box>
        방을 잃어버렸거나 방 비밀번호를 변경하고 싶은 경우, 또는 방을 지우고 싶은 경우에는&nbsp;
        <Link href="mailto:keyfrebern@gmail.com">keyfrebern@gmail.com</Link>
        으로 아래의 내용을 최대한 포함하여 문의해주세요.
      </Box>
      <ul>
        <li>- 방 제목</li>
        <li>- 들어있는 노래 목록</li>
        <li>- 스크린 샷</li>
      </ul>
    </Box>
  )
}

export default HelpPage
