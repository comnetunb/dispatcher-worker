const ddp = require('./src/ddp');
const communication = require('./src/communication');
const logger = require('./src/logger');
const tempManager = require('./src/manager/temp_manager');

try {
  tempManager.clean();
  ddp.execute();
  communication.execute();
} catch (err) {
  // Unhandled catch
  logger.error(err);
}
