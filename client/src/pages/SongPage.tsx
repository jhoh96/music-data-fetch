import React from "react";
import { Card, CardHeader, Image, Box, Text, Button } from "grommet";
import { useNavigate } from "react-router-dom";

import "./pageStyle.css";

export default function SongPage(params) {
  const title = params.params.title + " by " + params.params.artist;
  const releaseDate = "Released on " + params.params.releaseDate;
  const id = params.params.id
  const albumCover = params.params.albumCover;
  const lyricsUrl = params.params.lyricsUrl;
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("data_page", {
      state: {
        title: title,
        releaseDate: releaseDate,
        albumCover: albumCover,
        lyricsUrl: lyricsUrl,
        id: id
      },
    });
  };

  return (
    <div>
      <Card
        className="result-card"
        background="brand"
        height="medium"
        width="medium"
        opacity="true"
      >
        <CardHeader id="result-cardText" pad="medium">
          {title}
        </CardHeader>
        <Text id="result-cardText" size="small">
          {releaseDate}
        </Text>
        &nbsp;
        <Box width="small">
          <Image id="result-image" fit="cover" src={albumCover} />
        </Box>
        &nbsp;
        <Button primary label="Get Data" onClick={handleButtonClick} />
        <script
          type="text/javascript"
          src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuOP"
        />
      </Card>
    </div>
  );
}
