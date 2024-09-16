// MUI list of mapboxdraw geojson features
// MUI List of geojson features from mapboxdraw

import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

interface Props {
  geoJsonList: any;
  clickHandler?: (feature: any) => void;
}

const GeoJsonList: React.FC<Props> = ({ geoJsonList, clickHandler }) => {
  if (!geoJsonList.features) {
    return <div>No geojson data</div>;
  } else {
    return (
      <List>
        {geoJsonList.features.map((feature: any, index: number) => {
          return (
            <ListItem
              key={feature.id}
              onClick={() => clickHandler && clickHandler(feature.id)}
            >
              <ListItemText
                primary={feature.geometry.type}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    {feature.id}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>
    );
  }
};

export default GeoJsonList;
