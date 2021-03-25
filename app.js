
// const Logger = require('./logger');
// const logger = new Logger();

// logger.on('messageLogged', (arg) => {
//     console.log('Listerner caled', arg);
// });

// logger.log('message');

//******************************************* api creation *************************************/

// const Joi = require('joi');
// const express = require('express');
// const app = express();
// app.use(
//     express.urlencoded({
//       extended: true
//     })
//   )
// app.use(express.json());
// app.use(express.raw());

// const courses = [
//     {id: 1, name: 'course 1'},
//     {id: 2, name: 'course 2'},
//     {id: 3, name: 'course 3'}
// ];
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// // get all courses
// app.get('/api/courses', (req, res) => {
//     res.send(courses);
// });

// // post  course
// app.post('/api/courses', (req, res) => {
    
//     const {error}  = validateCourse(req.body);

//     if(error) {
//         res.send(error.message);
//         return false;
//     }

//     const course = {
//         id: courses.length+1,
//         name: req.body.name
//     };
//     courses.push(course);
//     res.send(courses);
// });

// // get course by id api/courses/1
// app.get('/api/courses/:id', (req, res) => {
//     const course =  courses.find(c => c.id === parseInt(req.params.id));
//     if(!course) { // 404
//         res.status(404).send('This id was not fetch');
//     }
//     res.status(200).send('id was found');
// });

// // update course
// app.put('/api/courses/:id', (req, res) => {
//     const course =  courses.find(c => c.id === parseInt(req.params.id));
//     if(!course) { // 404
//         res.status(404).send('This id was not fetch');
//     } else {
        
//         const {error} = validateCourse(req.body);
//         if(error) {
//             res.send(error.message);
//             return false;
//         }

//         course.name = req.body.name;
//         res.send(courses);
//     }
// });

// // delete course by id api/courses/1
// app.delete('/api/courses/:id', (req, res) => {
//     const course =  courses.find(c => c.id === parseInt(req.params.id));
//     if(!course) { // 404
//         res.status(404).send('This id was not fetch');
//     }
//     const index = courses.indexOf(course);
//     courses.splice(index, 1);
//     res.send(courses);
// });

// function validateCourse(course) {
//     const schema = Joi.object({
//         name: Joi.string()
//             .min(3)
//             .max(30)
//             .required(),
//         });
//         return schema.validate(course);
// }

// // PORT env var
// const port = process.env.PORT || 3000;
// app.listen(port, () => {console.log(`Listening port to ${port}....`);});


//******************************************* api creation *************************************/

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./auth');
const postRoute = require('./posts');

dotenv.config();
//cpnnect tp db

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => { console.log('Connected to DB...')}
);

app.use(express.json());
app.use(express.raw());


//route middleeares

app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Listening port to ${port}....`);});

  