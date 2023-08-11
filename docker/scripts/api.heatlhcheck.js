const http = require('http');

const WITH_SUCESS = 0;
const WITH_ERROR = 1;

function endProcessWithError(err) {
  console.error(err);
  process.exit(WITH_ERROR);
}

function pingApi() {
  const { API_PORT } = process.env;
  if (!API_PORT) endProcessWithError(`Error: API_PORT not in process.env`);
  const HEALTHCHECK_ENDPOINT = '/healthcheck/ready';

  const request = http.request({
    host: 'localhost',
    port: API_PORT,
    path: HEALTHCHECK_ENDPOINT,
    method: 'GET',
    timeout: 2000,
  }, (res) => {
    const statusMessage = `STATUS: ${res.statusCode}`;
    const isErrorStatusCode = res.statusCode >= 400;
    if (isErrorStatusCode) endProcessWithError(statusMessage);
    process.exit(WITH_SUCESS);
  });

  request.on('error', endProcessWithError);
  request.end();
}
pingApi();
