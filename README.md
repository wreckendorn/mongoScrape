# mongoScrape

This is a full stack web app that lets users view and leave comments on the latest news provided by Medium (so far). This app uses the following technologies:

Node.js
Express
Express-handlebars
Mongoose
Body-Parser
Cheerio
Request
Morgan
CSS
Javascript/JQuery

There are three links at the top of the page when you first visit the site: Home, Saved, and Scrape.

## Home
The Home view is where you can see all of the scraped articles that currently exist in the database - whether they are saved or not. From here, you can choose to scrape Medium and add new articles to the database. You can also visit the Saved page.

![ScreenShot](https://github.com/wreckendorn/mongoScrape/blob/master/images/HomeView.png)
![ScreenShot](https://github.com/wreckendorn/mongoScrape/blob/master/images/SavedArticleButton.png)

## Scrape
The scrape button will look for all new articles on Medium and organize them into objects using the title of the article, the link to the article, and a brief summary of what's in the article.

## Saved
The Saved view is where you can view all of your saved articles. From here, you can choose to Delete an article or add/view/delete any notes associated with a particular article. Once the user clicks on 'Article Notes', a modal is seen with the option to view existing notes, create a new note, or delete an existing note. These notes will remain in the database until the user deletes them.

![ScreenShot(https://github.com/wreckendorn/mongoScrape/blob/master/images/SavedArticleView.png)

To get started, simply visit: https://blooming-oasis-10917.herokuapp.com/

I am the sole contributor on this project and will maintain it. You can reach me at thechrisheckendorn@gmail.com for any questions.
