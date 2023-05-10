# TrailBlazers

TrailBlazers-V2 is a web application that aims to simplify the process of organizing and managing hiking trips. The application.

## Tech Stack
- React
- Express
- Node
- PostgreSQL
- Websocket (Socket.io)
- Passport.js
- AWS S3
- Google Oauth

## Features

- Browse hiking trips
- View key information about certain trails (weather, difficulty, reviews, etc.)
- Favourite trails
- Browse the location of the trail using Google Maps
- Leave a review for the trail 
- Upload images for each trail
- Multi-room chat for each trail on topics such as (find a trail buddy, trail conditions and updates, off-trail activities)
- User authentication and authorization

## Getting Started

To run the application locally, follow these steps:

1. Clone the repository: `git clone https://github.com/TrailBlazersCollaborative/TrailBlazers-V2.git`
2. Navigate to the project directory: `cd TrailBlazers-V2`
3. Install the required packages: `npm install`
4. Start the application: `npm start`
5. Navigate to http://localhost:3000 in your web browser

## Usage

Once the application is running, login using google Oauth, then you can browse the list of hiking trips by location over a certain radius. To browse a certain trail select the trail and browse the information provided. To chat with other users, select the room you would like to join and chat with other users. If you like the trail, click the star button to favourite the trail. In order, to leave a review type a review in the review card and post it to the application and add photos by selecting the add photo button and then upload a photo from your computer. 

## Contributing

Contributions are welcome and appreciated! If you would like to contribute to the project, please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b my-new-feature`
3. Make your changes and commit them: `git commit -am 'Add some feature'`
4. Push your changes to your fork: `git push origin my-new-feature`
5. Create a new Pull Request
