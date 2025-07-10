import { Box, Button, Typography } from '@mui/material'
import { HomepageStyles } from '../../styles/homepage-styles'

function Footer() {
  return (
    <Box sx={HomepageStyles.footerContainer}>
        <Button variant='contained' sx={HomepageStyles.footerButton}>
            View Articles
        </Button>
        <Typography sx={HomepageStyles.footerText}>Made With &#128513; BY Guddu Shakar Paul</Typography>
        <Button variant='contained' sx={HomepageStyles.footerButton}>
            Publish One
        </Button>
    </Box>
  )
}

export default Footer