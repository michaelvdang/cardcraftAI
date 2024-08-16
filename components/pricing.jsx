import { useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';

const Pricing = () => {
  useEffect(() => {
    // Dynamically load the Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Box sx={{ my: 6, textAlign: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Pricing
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* Stripe Pricing Table */}
        <div>
          <stripe-pricing-table
            pricing-table-id="prctbl_1PoDKMC3afAR2U7cs6AXIO1B"
            publishable-key="pk_live_51PoCQOC3afAR2U7cTuFmqc2EOLLnmyNcTHuEHxLSnYE7Jf0tdbL0orklpMiHo5ESXdumbGhq8xDrEscGwB993Bun00nzUxnWb2"
          ></stripe-pricing-table>
        </div>
      </Grid>
    </Box>
  );
};

export default Pricing;