# Welcome to Music-Data-Fetch
Music-Data-Fetch or MDF is a simple data search/map application using React and NodeJS. Application can be accessed via the [demo](https://jhoh96.github.io/music-data-fetch/) link.
# React & Frontend
Application client is written in Create-React-App (*CRA*) using  the frontend UI library [grommet](https://v2.grommet.io/) for React. 
## Core/Packages
**Data Visualisation :** [@visx](https://airbnb.io/visx/) - A free data visualisation primitives created by AirBnB.

**API request to backend server :** [axios](https://axios-http.com/docs/intro) - Async call requests package for React.

**Colour Study/Theme Design:** [AdobeColor](https://color.adobe.com/)- Selection of complimentary colours and .shades for the application.

**Fonts:** [Google](https://fonts.google.com/) - Most frequently used font packs.

**Framer Motion**: [Framer](https://www.framer.com/motion/) - One of the most popular animation/motion library for React.

**Firebase/Github** - Free static web hosting servers for the Frontend.

## Design
#### Colours_
[Color Choice #1](https://github.com/jhoh96/music-data-fetch/blob/master/client/src/assets/MainThemeAnalogous.png)
[Color Choice #2](https://github.com/jhoh96/music-data-fetch/blob/master/client/src/assets/MainThemeComplimentary.png)

Colour theory & colour selection dictate optimal use and allure. Selecting colours for a website necessitates choosing color combinations which are sober and harmonious to the eye. Grommet UI library priorities purple, and choosing the optimal complimentary colours and shades was important.

#### Page Routing/Component Placements_
The application's main priority is data visualisation with emphasis on allure and colours. Too many components and page routings can direct a user's attention away from the main visuals. 
Therefore in the design process, I minimised the page routing and removed unnecssary component renders to prevent diversion. 

## Langauge & Libraries

**TypeScript** - Main
**jQuery** - For HTML DOM Tree Traversal used in Web Scraping
**React** - Light-weight SPA for frontend

# NodeJS & Backend
## Core/Packages/Frameworks
**ExpressJS**: [Express](https://expressjs.com/) - Backend Web Application framework.

**Axios**: [Axios](https://github.com/sheaivey/react-axios) - For async API requests.

**Puppeteer**: [Puppeteer](https://pptr.dev/) - Automating Chrome Browser for website tests. In our case, HTML Scraping to fetch lyrics from genius.com as the API doesn't directly provide lyrics data. (And for practice :D)

**Heroku**:  [enter link description here](https://dashboard.heroku.com/) - Free web servers for the Backend.

## Languages & Libraries
**NodeJS** - Enables Javascript for back-end. 




# Issues & Limitations
* Memory Usage / Server Timeout with Heroku & Puppeteer.
	 - Web/HTML Scraping can be heavy and cause many issues with free server services
	 - Properly handling/closing async requests through puppeteer to prevent overload

Please contact me at http://www.justinoh.dev using the contact form if any problem occurs within the application.
