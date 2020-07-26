const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const restaurants = require('./models/restaurants');
const user = require ('./models/users');
const address=require('./models/address');
const menu=require('./models/menu');
const login=require('./models/login');
const section=require('./models/section');
const menuitem=require('./models/menuitem');
const booking=require('./models/booking');
const owner=require('./models/owner')
const manager=require('./models/manager')
const host=require('./models/host')
const tablesection=require('./models/tablesection');
const table=require('./models/table');
const dateTableDate=require('./models/dateTableDate')
const mysql=require('mysql')
const connection = mysql.createConnection({
 host     : 'mymysql.senecacollege.ca',
  user     : 'prj566_201a04',
  password : 'ngNQ@6374',
  database : 'prj566_201a04'
});

connection.connect();
const port = process.env.PORT || 8080;

const app = express()

  .use(cors())
  .use(bodyParser.json())
  .use(restaurants(connection))
  .use(user(connection))
  .use(login(connection))
  .use(address(connection))
  .use(menu(connection))
  .use(section(connection))
  .use(menuitem(connection))
  .use(booking(connection))
  .use(owner(connection))
  .use(manager(connection))
  .use(host(connection))
  .use(tablesection(connection))
  .use(table(connection))
  .use(dateTableDate(connection))
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
