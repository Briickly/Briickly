#### Connect to DB
npm i mongoose
npm i dotenv

add MONGO url in .env
add .env to .gitignore


#### Create routes
> Use Insomnia or postman to check auth route (It is needed bcz as such rn we dont have any ofrm etc. in frontend to send data)


npm i bcryptjs


redux toolkit: used to preserve the user state/user data globally to use across pages (may be like profile page, user stats page, etc)

redux persist: once we refresh the page, the data stored by the redux toolkit (user data) is vanished, so we need to keep it i.e. it must persist even after refresh (by storing in local browser's storage)