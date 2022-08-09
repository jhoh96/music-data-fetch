import React from "react";
import { Card, CardHeader, Image, Box, Text, Button } from "grommet";
import { useNavigate } from "react-router-dom";

import "./pageStyle.css";

export default function SongPage(params) {
  const title = params.params.title + " by " + params.params.artist;
  const releaseDate = "Released on " + params.params.releaseDate;
  const id = params.params.id;
  const albumCover = params.params.albumCover;
  const lyricsUrl = params.params.lyricsUrl;
  const isHot = params.params.isHot;
  const pageViews = params.params.pageViews;
  const releaseDateComp = params.params.releaseDateComp;
  const artistID = params.params.artistID
  const navigate = useNavigate();

  const handleButtonClick = (e) => {
    e.preventDefault()
    navigate("data_page", {
      state: {
        title: title,
        releaseDate: releaseDate,
        albumCover: albumCover,
        lyricsUrl: lyricsUrl,
        id: id,
        isHot: isHot,
        pageViews: pageViews,
        releaseDateComp: releaseDateComp,
        artistID: artistID
      },
    });
  };

  return (
    <div className="song-page-div">
      <Card
        className="result-card"
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
        <Button
          id="result-button"
          primary
          label="Get Data"
          onClick={e=>handleButtonClick(e)}
        />
        <script
          type="text/javascript"
          src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuOP"
        />
      </Card>
    </div>
  );
}
