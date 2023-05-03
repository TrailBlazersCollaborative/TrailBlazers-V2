import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useEffect } from 'react';
import assetExports from './assets/assetExports'

export default function TrailInfoCard({trail, index}) {

  console.log(trail);
  return (
    <Card sx={{ maxWidth: 345, maxHeight: 345, minWidth: 345, boxShadow: 3 }} className="trail-info-card">
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          width="200"
          src={assetExports.mtnBikingPics[index]}
        />
        <CardContent sx={{ minHeight: 200 }}>
          <Typography gutterBottom variant="h6" noWrap component="div">
            {trail.name}
          </Typography>
          <Typography variant="subtitle2">
                <span>{trail.length > 1 ? `${Math.trunc(trail.length)} miles` : `${Math.trunc(trail.length)} mile`}</span>
                {
                  trail.difficulty ? <span>  • {trail.difficulty}</span> : undefined
                }
          </Typography>
          <Typography variant="body2" color="text.secondary" className="trail-description">
            {trail.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
