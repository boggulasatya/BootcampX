const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'bootcampx'
});

// Sample query to test the connection
pool.query('SELECT * FROM students', (err, result) => {
  if (err) {
    console.error('Error executing query:', err.stack);
  } else {
    console.log('Query result:', result.rows);
  }
});

// Error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const cohortName = process.argv[2] || '';
const limit = process.argv[3] || 5;

const query = `
SELECT students.id as student_id, students.name as name, cohorts.name as cohort
FROM students
JOIN cohorts ON cohorts.id = cohort_id
WHERE cohorts.name LIKE $1
LIMIT $2;
`;
// Store all potentially malicious values in an array
pool.query(query, [`%${cohortName}%`, limit])
  .then(res => {
    res.rows.forEach(user => {
      console.log(`${user.name} has an id of ${user.student_id} and was in the ${user.cohort} cohort`);
    });
    pool.end();
  })
  .catch(err => {
    console.error('Error executing the query:', err);
    pool.end();
  });