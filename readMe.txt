

# Diary

LIVE AT :

https://arcane-basin-16762.herokuapp.com/


##############################################################################################################

        Added properties file, which will tell where to point
        Chage it to local when doing any developement changes


#############################################################################################################

For media storage we are using cloudinary.com
Thanks cloudinary.com.

A personalised diary where you can place all your emotions.

Always run git status, to check which files have been modified.
Then git diff -- file path in order to see what is changed


to upload new codebase to heroku go to myapp folder
git add .
git commit -m "added console.log for db connectivity"
git push heroku master
heroku open



heroku logs ------- to check logs


heroku local web ---- to open app in local

for heroku deployed app
existing user is

name : bhalke
password : bhalke

some links
https://dashboard.heroku.com/apps/arcane-basin-16762/settings
https://devcenter.heroku.com/articles/deploying-nodejs#prerequisites
https://devcenter.heroku.com/articles/git
https://scotch.io/tutorials/use-mongodb-with-a-node-application-on-heroku


mongolab

https://mlab.com/databases/privatediary#stats

















How to run::
1) your database is in c:\program files\MongoDB\Server\3.0\bin
So start mongo db from there by command ::: "mongod"

2) Now open another terminal, go to same path as mentioned above, and run comand "mongo" 
(Remember database name is "notesdb").

3) Now open another terminal and come to this path C:\Users\rohit_000\Desktop\NotesApp\Notes1.1\myapp

4) Now to run the app use command set DEBUG=myapp & npm start

5) Now hit localhost:5000

6) caution newly created "diary" database -->

 db.diary.insert({"name":"Rohit","password":"rohit","email":"rohitbhalke@gmail.com",
 "notes":{"time":"Thu Oct 22 2015 10:41:42 GMT+0530 (IST)","title":"Test","description":"Test Description"}})



localhost:5000/notes        For notes
localhost:5000/users        not started yet
localhost:5000/             loginPage

cd $MONGO_PATH


mongo commands
1) to show all available dbs -->  show dbs
2) create new db -->  use newDbName
3) switch to db --> use newDbName
4) show db content --> db.newDbName.find()

db.databaseNotes.insert({"name":"rohit","password":"rohit","email":"rohitbhalke@gmail.com",
 "notes":[{"time":"Thu Oct 22 2015 10:41:42 GMT+0530 (IST)","title":"Test","description":"Test Description"}]})


db.databaseNotes.insert({"name":"rohit","password":"rohit","email":"rohitbhalke@gmail.com",
 "notes":[{"id":'abc',"time":"Thu Oct 22 2015 10:41:42 GMT+0530 (IST)","title":"Test","description":"Test Description"},
 {"id":'jkl',"time":"Thu Oct 22 2015 10:41:42 GMT+0530 (IST)","title":"Next","description":"Next future"}]})


db.databaseNotes.insert({"name":"batman","password":"gotham","email":"batman@gotham.com",
 "notes":[{"id":'abc',"time":"Thu Oct 22 2015 10:41:42 GMT+0530 (IST)","title":"I am the hero You need","description":"Not the one who deserves :("},
 {"id":'jkl',"time":"Thu Oct 22 2015 10:41:42 GMT+0530 (IST)","title":"I will Protect Gotham till the end","description":"Sometimes people deserve more"}]})

*******************************************************************************************
Things to do

1) Session management (shouldn't allow to go to account via url unless login credentials are entered)
2) Google integration as passport google module is not supported by google
3) front end
   a) Increase the no of fields in create new form like name, birth date etc. see what fb is providing in profile object
      and add appropriately
   b) Change design make all forms look good (css changes #crap)
   c) responsive (really do i really want????)
4) mongolab connectivity i.e. make our db hosted as free (yeaaa...)
5) Finaly upload to heroku.
















